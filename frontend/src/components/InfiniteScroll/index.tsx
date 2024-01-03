import React, { useRef, useEffect, useState } from 'react';

interface InfiniteScrollProps {
  fetchMoreData: () => Promise<void>;
  children: React.ReactNode;
  customClassName?: string;
  hasMore?: boolean;
}

const InfiniteScroll = ({
  fetchMoreData,
  children,
  customClassName,
  hasMore = true,
}: React.PropsWithChildren<InfiniteScrollProps>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      if (
        hasMore &&
        scrollElement &&
        scrollElement.scrollTop <= 100 &&
        !loading
      ) {
        setLoading(true);
        fetchMoreData()
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
    };

    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchMoreData, loading, hasMore]);

  return (
    <div ref={scrollRef} className={customClassName}>
      {loading && <p>Loading...</p>}
      {children}
    </div>
  );
};

export default InfiniteScroll;
