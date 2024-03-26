"use client";

import styled from "styled-components";
import { OverlayMetadata } from "../../page";
import { useEffect, useRef, useState } from "react";
import { Flex, Input, InputRef, Tag, Tooltip, notification, theme } from "antd";
import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout } from "@/types/element.types";
import { NotificationPlacement } from "antd/es/notification/interface";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FieldTitle = styled.div`
  width: 25%;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
`;

const FieldInput = styled.div`
  width: 75%;
  display: flex;
  align-items: center;
  input {
    width: 100%;
    height: 25px;
    outline: none;
    border: none;
    background-color: rgba(0, 0, 0, 0.04);
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  padding-top: 40px;
  button {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    outline: none;
    border: none;
    background-color: blue;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
    color: white;
    cursor: pointer;
    opacity: 1;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

type Props = {
  overlayMetadata: OverlayMetadata;
  closeModal: () => void;
};

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: "26px",
  fontSize: "16px",
  marginInlineEnd: 8,
  verticalAlign: "top",
};

const SaveLayoutModal: React.FC<Props> = ({ overlayMetadata, closeModal }) => {
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Saved`,
      description: "Your layout has been saved to our system.",
      icon: <CheckCircleOutlined />,
      placement,
    });
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const save = async () => {
    const data = {
      metadata: JSON.stringify(overlayMetadata),
      tags,
      name: title,
    };
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/layout/create`,
        method: "POST",
        data,
        withCredentials: true,
      });
      alert(true);
    } catch (err) {}
    setTags([]);
    setTitle("");
    closeModal();
    setTimeout(() => openNotification("top"), 250);
  };

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 26,
    background: token.colorBgContainer,
    borderStyle: "dashed",
    fontSize: "14px",
  };

  return (
    <Container>
      {contextHolder}
      <Body>
        <FieldContainer>
          <FieldTitle>Title</FieldTitle>
          <FieldInput>
            <input
              placeholder="Enter layout title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FieldInput>
        </FieldContainer>

        <FieldContainer>
          <FieldTitle>Tags</FieldTitle>
          <FieldInput>
            <Flex gap="4px 0" wrap="wrap">
              {tags.map<React.ReactNode>((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={editInputRef}
                      key={tag}
                      size="middle"
                      style={tagInputStyle}
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}
                    />
                  );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    closable={true}
                    style={{
                      userSelect: "none",
                      fontSize: "16px",
                      height: "26px",
                    }}
                    onClose={() => handleClose(tag)}
                  >
                    <span
                      onDoubleClick={(e) => {
                        if (index !== 0) {
                          setEditInputIndex(index);
                          setEditInputValue(tag);
                          e.preventDefault();
                        }
                      }}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </span>
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag
                  style={tagPlusStyle}
                  icon={<PlusOutlined />}
                  onClick={showInput}
                >
                  New Tag
                </Tag>
              )}
            </Flex>
          </FieldInput>
        </FieldContainer>
      </Body>
      <Footer>
        <button
          disabled={title.trim().length === 0 || tags.length === 0}
          onClick={save}
        >
          Save
        </button>
      </Footer>
    </Container>
  );
};

export default SaveLayoutModal;
