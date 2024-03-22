"use client";

import styled from "styled-components";
import { Layout } from "../types/element.types";
import TemplateItem from "@/components/template-item";
import { useRouter } from "next/navigation";
import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";

const TemplatesList = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

type Props = {
  layouts: Layout[];
};

const SearchView: React.FC<Props> = ({ layouts }) => {
  const router = useRouter();

  const handleOnSelectLayout = (index: number) => {
    router.push(`/overlay-builder/setup?id=${index}`);
  };

  return (
    <HeaderPanelLayout>
      <TemplatesList>
        {layouts.map((layout, i) => (
          <TemplateItem
            onClick={() => handleOnSelectLayout(i)}
            layout={layout}
            width="calc(100% / 4 - 15px)"
            key={i}
          />
        ))}
      </TemplatesList>
    </HeaderPanelLayout>
  );
};

export default SearchView;
