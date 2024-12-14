import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ref,
  onValue,
  query,
  orderByChild,
  endAt,
  limitToLast,
  startAt,
  onChildAdded,
} from 'firebase/database';
import { realtimeDb as db } from '@/app/lib/firebase/clientApp';
import useEffectAfterMount from './useEffectAfterMount';

interface FirebaseData {
  key: string;
  [key: string]: any;
}

interface UseFirebasePaginationResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  handleMore: () => void;
  resetState: () => void;
  pageNo: number;
  hasMore: boolean;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

function useRTDBPagination(
  dbPath: string | null,
  limit: number,
): UseFirebasePaginationResult {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [firstKey, setFirstKey] = useState<string | null>(null);
  const [latestKey, setLatestKey] = useState<string | null>(null); // Track the latest record
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [listen, setListen] = useState<string | null>(null);

  const memorizeDbPath = useMemo(() => dbPath, [dbPath]);

  // useEffect(() => {
  //   console.log(
  //     '🚀 ~ file: useRTDBPagination.ts ~ line 118 ~ memorizeDbPath',
  //     memorizeDbPath,
  //   );
  // }, [memorizeDbPath]);

  // Pagination effect
  useEffect(() => {
    if (!memorizeDbPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const dbRef = ref(db, memorizeDbPath);
    let dbQuery;

    if (firstKey) {
      dbQuery = query(
        dbRef,
        orderByChild('createdAt'),
        endAt(firstKey),
        limitToLast(limit),
      );
    } else {
      dbQuery = query(dbRef, orderByChild('createdAt'), limitToLast(limit));
    }

    const unsubscribe = onValue(
      dbQuery,
      (snapshot) => {
        const fetchedData: FirebaseData[] = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          fetchedData.push({
            key: childKey as string,
            ...childData,
          });
        });

        // Check if we need to remove the first item due to pagination overlap
        const moreDataAvailable = fetchedData.length >= limit;
        // if (moreDataAvailable) {
        //   fetchedData.shift();
        // }

        // Filter out any items with duplicate keys
        // Ensure that `data` is an array of objects with a `key` property
        const existingKeys = new Set(data.map((item) => item.key));

        // Filter out duplicates from `fetchedData`
        const uniqueData = fetchedData.filter((newItem) => {
          const isDuplicate = existingKeys.has(newItem.key);
          if (!isDuplicate) {
            existingKeys.add(newItem.key); // Add new key to the Set
          }
          return !isDuplicate;
        });

        // Update firstKey for the next page (earliest item from current batch)
        const firstItem = uniqueData[0];
        setFirstKey(firstItem?.createdAt || null);

        // Update latestKey for tracking new records
        if (uniqueData.length) {
          const lastItem = uniqueData[uniqueData.length - 1];
          setLatestKey(lastItem?.createdAt || null);
        }

        // Determine if there is more data to load
        setHasMore(moreDataAvailable);

        // Append the new data to maintain the correct order
        setData((prevData) => [...prevData, ...uniqueData]);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [memorizeDbPath, limit, pageNo]);

  useEffect(() => {
    if (data.length > 0) {
      setListen(data[0].createdAt);
    }
  }, [data]);

  // Real-time updates for new records
  useEffectAfterMount(() => {
    if (!listen) return;
    if (!memorizeDbPath) {
      setLoading(false);
      return;
    }
    const dbRef = ref(db, memorizeDbPath);
    const realTimeQuery = query(
      dbRef,
      orderByChild('createdAt'),
      startAt(listen),
    );

    const unsubscribe = onChildAdded(realTimeQuery, (snapshot) => {
      const newRecord = {
        key: snapshot.key as string,
        ...snapshot.val(),
      };

      // Append new record if it’s not already in the data
      setData((prevData) => {
        if (!prevData.some((item) => item.key === newRecord.key)) {
          return [newRecord, ...prevData]; // Prepend the new record at the beginning
        }
        return prevData;
      });
    });

    return () => unsubscribe();
  }, [memorizeDbPath, listen]);

  const handleMore = useCallback(() => {
    if (hasMore) {
      setPageNo((prevPageNo) => prevPageNo + 1);
    }
  }, [hasMore]);

  const resetState = useCallback(() => {
    setData([]);
    setLoading(true);
    setError(null);
    setFirstKey(null);
    setListen(null);
    setLatestKey(null);
    setHasMore(true);
    setPageNo(1);
  }, []);

  return { data,setData, loading, error, handleMore, pageNo, hasMore, resetState };
}

export default useRTDBPagination;
