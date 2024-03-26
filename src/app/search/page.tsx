"use client";

import { useEffect, useState } from "react";
import { Layout, Layout_API } from "../../types/element.types";
import SearchView from "./view";
import Loading from "@/components/loading";
import axios from "axios";

const SearchPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const searchLayouts = async () => {
      let query =
        Object.keys(searchParams).length === 0 ? "page=0&sortBy=pop" : "";
      Object.keys(searchParams).forEach((key) => {
        query += `${key}=${searchParams[key]}&`;
      });
      const response = await axios({
        url: `${
          process.env.NEXT_PUBLIC_API_BASE_ROUTE
        }/layout/layouts/${query.substring(0, query.length - 1)}`,
      });
      const data = response.data;
      const items = data.data.items as Layout_API[];
      const layouts: Layout[] = [];
      items.forEach((item) => {
        const layout: Layout = {
          id: item.id,
          authorName: item.author.username,
          overlayMetadata: JSON.parse(item.metadata),
          tags: item.tags,
          title: item.name,
          createdAt: item.createdAt,
          name: item.name,
        };
        layouts.push(layout);
      });
      setLayouts(layouts);
      setLoading(false);
    };
    searchLayouts();
  }, [searchParams]);

  if (isLoading) return <Loading />;
  return <SearchView layouts={layouts} />;
};

export default SearchPage;
