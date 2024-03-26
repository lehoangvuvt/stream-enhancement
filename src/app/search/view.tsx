"use client";

import styled from "styled-components";
import { Layout } from "../../types/element.types";
import TemplateItem from "@/components/template-item";
import { useRouter } from "next/navigation";
import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";

export const TemplatesList = styled.div`
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

  const handleOnSelectLayout = (layout: Layout) => {
    router.push(`/overlay-builder/setup?id=${layout.id}`);
  };

  return (
    <HeaderPanelLayout>
      <TemplatesList>
        {layouts.map((layout) => (
          <TemplateItem
            onClick={() => handleOnSelectLayout(layout)}
            layout={layout}
            width="calc(100% / 4 - 15px)"
            key={layout.id}
          />
        ))}
      </TemplatesList>
    </HeaderPanelLayout>
  );
};

export default SearchView;
