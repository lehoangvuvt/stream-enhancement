"use client";

import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";
import { useAppStore } from "@/zustand/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Layout_API } from "../../types/element.types";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import OverlayViewRO from "@/components/overlay-view-ro";
import Loading from "@/components/loading";

const Container = styled.div`
  width: 95%;
  margin: 40px auto;
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  box-sizing: border-box;
`;

const GroupByDateLayoutsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  padding-bottom: 30px;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
`;

const DateTime = styled.div`
  width: 100%;
  padding: 10px 2px;
  box-sizing: border-box;
  color: white;
  font-size: 14px;
`;

const LayoutsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  margin-top: 5px;
`;

const LayoutItem = styled.div`
  width: 20%;
  aspect-ratio: 16/9;
  background-color: rgba(255, 255, 255, 1);
  overflow: hidden;
`;

const MyLayoutsPage = () => {
  const router = useRouter();
  const { userInfo } = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState<Record<string, Layout[]> | null>(null);

  useEffect(() => {
    const getLayouts = async () => {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/user/layouts`,
        withCredentials: true,
        method: "GET",
      });
      const data = response.data as { message: string; data: Layout_API[] };
      const sortedByCreatedLayouts = data.data.sort(
        (item1, item2) =>
          new Date(item2.createdAt ?? new Date()).getTime() -
          new Date(item1.createdAt ?? new Date()).getTime()
      );
      const layouts: Record<string, Layout[]> = {};
      sortedByCreatedLayouts.forEach((layoutApi) => {
        const date = new Date(layoutApi.createdAt ?? new Date());
        const key = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        const layout: Layout = {
          id: layoutApi.id,
          authorName: layoutApi.author.username,
          overlayMetadata: JSON.parse(layoutApi.metadata),
          tags: layoutApi.tags,
          title: layoutApi.name,
          createdAt: layoutApi.createdAt,
          name: layoutApi.name,
        };
        if (!layouts[key]) {
          layouts[key] = [layout];
        } else {
          layouts[key].push(layout);
        }
      });
      setLayouts(layouts);
      setLoading(false);
    };
    if (userInfo) {
      getLayouts();
    } else {
      router.push("/search");
    }
  }, [userInfo]);

  if (isLoading) return <Loading />;
  return (
    <HeaderPanelLayout showHeader={false}>
      <Container>
        {layouts &&
          Object.keys(layouts).length > 0 &&
          Object.keys(layouts).map((key) => (
            <GroupByDateLayoutsContainer key={key}>
              <DateTime>{key}</DateTime>
              <LayoutsContainer>
                {layouts[key].map((layout, lIndex) => (
                  <LayoutItem key={lIndex}>
                    <OverlayViewRO overlayMetadata={layout.overlayMetadata} />
                  </LayoutItem>
                ))}
              </LayoutsContainer>
            </GroupByDateLayoutsContainer>
          ))}
      </Container>
    </HeaderPanelLayout>
  );
};

export default MyLayoutsPage;
