import { db } from "@/app/lib/firebase/clientApp";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  updateDoc,
} from "firebase/firestore";
import {  UserModal } from "../models/UserModel";
import { LIMIT_USERS_LIST_PAGINATION } from "@/app/lib/constants";
import * as Yup from "yup";

export class UserService {
  private static instance: UserService | null = null;
  private userCollection;

  private constructor() {
    this.userCollection = collection(db, "USERS_COLLECTION");
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getPaginationUsers(pageNo: number) {
    try {
      let DocsQuery = query(
        this.userCollection,
        // orderBy("createdAt"),
        limit(LIMIT_USERS_LIST_PAGINATION),
      );

      if (pageNo > 1) {
        const previousPageQuery = query(
          this.userCollection,
          // orderBy('createdAt'),
          limit((pageNo - 1) * LIMIT_USERS_LIST_PAGINATION),
        );
        const previousPageSnapshot = await getDocs(previousPageQuery);
        const lastVisible =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];

        if (lastVisible) {
          DocsQuery = query(
            this.userCollection,
            // orderBy('createdAt'),
            startAfter(lastVisible),
            limit(LIMIT_USERS_LIST_PAGINATION),
          );
        }
      }

      const usersList = await getDocs(DocsQuery);
      const allUsersList = usersList.docs.map((_doc) => ({
        uid: _doc.id,
        ..._doc.data(),
      })) as UserModal[];
      return allUsersList;
    } catch (e) {
      throw e;
    }
  }

  public async searchUsers(pageNo: number, searchQuery: string) {
    try {
      let normalizedSearch = searchQuery;
      const emailSchema = Yup.string().email();

      if (
        (typeof normalizedSearch === "string" &&
          normalizedSearch.includes("@")) ||
        emailSchema.isValidSync(normalizedSearch)
      ) {
        normalizedSearch = normalizedSearch.toLowerCase();
      }
      const emailQ = [
        where("email", ">=", normalizedSearch),
        where("email", "<=", normalizedSearch + "\uf8ff"),
        orderBy("email"),
        limit(LIMIT_USERS_LIST_PAGINATION),
      ];

      const userIdQ = [
        where("uid", ">=", normalizedSearch),
        where("uid", "<=", normalizedSearch + "\uf8ff"),
        orderBy("uid"),
      ];

      // Query for email
      let emailQuery = query(this.userCollection, ...emailQ);

      // Query for displayName
      let displayNameQuery = query(
        this.userCollection,
        ...userIdQ,
        limit(LIMIT_USERS_LIST_PAGINATION),
      );

      if (pageNo > 1) {
        const previousPageQuery = query(
          this.userCollection,
          ...emailQ,
          limit((pageNo - 1) * LIMIT_USERS_LIST_PAGINATION),
        );
        const previousPageSnapshot = await getDocs(previousPageQuery);
        const lastVisible =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];

        if (lastVisible) {
          emailQuery = query(
            this.userCollection,
            ...emailQ,
            startAfter(lastVisible),
            limit(LIMIT_USERS_LIST_PAGINATION),
          );
        }

        const previousDisplayNamePageQuery = query(
          this.userCollection,
          ...userIdQ,
          limit((pageNo - 1) * LIMIT_USERS_LIST_PAGINATION),
        );
        const previousDisplayNamePageSnapshot = await getDocs(
          previousDisplayNamePageQuery,
        );
        const lastDisplayNameVisible =
          previousDisplayNamePageSnapshot.docs[
            previousDisplayNamePageSnapshot.docs.length - 1
          ];

        if (lastDisplayNameVisible) {
          displayNameQuery = query(
            this.userCollection,
            ...userIdQ,
            startAfter(lastDisplayNameVisible),
            limit(LIMIT_USERS_LIST_PAGINATION),
          );
        }
      }

      const emailDocs = await getDocs(emailQuery);
      const displayNameDocs = await getDocs(displayNameQuery);

      const userSet = new Set<string>();
      const allUsers: UserModal[] = [];

      emailDocs.docs.forEach((_doc) => {
        const users = _doc.data() as UserModal;
        if (!userSet.has(users.uid)) {
          userSet.add(users.uid);
          allUsers.push(users);
        }
      });

      displayNameDocs.docs.forEach((_doc) => {
        const users = _doc.data() as UserModal;
        if (!userSet.has(users.uid)) {
          userSet.add(users.uid);
          allUsers.push(users);
        }
      });

      console.log({ allUsers, msg: "allUsers" });
      return allUsers;
    } catch (error) {
      throw error;
    }
  }
}
