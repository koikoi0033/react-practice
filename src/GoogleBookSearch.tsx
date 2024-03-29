import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { VolumeList } from 'models/Volume';

export const GoogleBookSearch: React.FC = () => {
  const [queryString, changeQueryString] = useState<string>('');
  const [searchResult, changeSearchResult] = useState<VolumeList>(new VolumeList());

  const searchGoogleBooks = async (query: string) => {
    const url = 'https://www.googleapis.com/books/v1/volumes';
    const params = { q: query, startIndex: 80, maxResults: 40 };
    try {
      const response = await axios.get(url, { params });
      return {
        isSuccess: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      return {
        isSuccess: false,
        data: null,
        error: error,
      };
    }
  };

  const handleOnSearchButton = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // form要素のbuttonのsubmitを止める
    event.preventDefault();
    const result = await searchGoogleBooks(queryString);
    if (result.isSuccess) {
      changeSearchResult(VolumeList.fromResponse(result.data));
    } else {
      window.alert(String(result.error));
    }
  };

  return (
    <Wrapper>
      <Body>
        <Title>Google Books Search</Title>
        <SearchForm>
          <Input placeholder='検索ワードを入力してください' onChange={event => changeQueryString(event.target.value)} />
          <SearchButton onClick={event => handleOnSearchButton(event)} disabled={!queryString}>
            検索
          </SearchButton>
        </SearchForm>
        {searchResult.kind && (
          <ResultContent>
            {searchResult.items.map(item => {
              return <ResultTitle key={item.id}>{item.volumeInfo.title}</ResultTitle>;
            })}
          </ResultContent>
        )}
      </Body>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Body = styled.div``;

const Title = styled.h1`
  text-align: center;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
const Input = styled.input`
  display: block;
  box-sizing: border-box;
  width: 250px;
  font-size: 18px;
  padding: 10px;
  outline: none;
`;

const SearchButton = styled.button`
  color: #fff;
  background-color: #09d3ac;
  border-radius: 3px;
  margin-left: 10px;
  padding: 10px;
  font-size: 18px;
  border: none;
  outline: none;
  transition: 0.4s;
  cursor: pointer;
  &:disabled {
    background-color: #bfbfbf;
    cursor: not-allowed;
  }
`;

const ResultContent = styled.div`
  margin-top: 20px;
`;

const ResultTitle = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid;
  &:first-of-type {
    border-top: 1px solid;
  }
`;
