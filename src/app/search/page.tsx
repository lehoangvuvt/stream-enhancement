"use client";

import { useEffect, useState } from "react";
import { Layout } from "../../types/element.types";
import SearchView from "./view";
import Loading from "@/components/loading";
import LayoutService from "@/services/layout.service";

const SearchPage = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const searchLayouts = async () => {
      const data = await LayoutService.searchLayouts(searchParams);
      if (data) {
        const layouts: Layout[] = [];
        data.forEach((item) => {
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
      }
      setLoading(false);
    };
    searchLayouts();
  }, [searchParams]);

  if (isLoading) return <Loading />;
  return <SearchView layouts={layouts} />;
};

export default SearchPage;
