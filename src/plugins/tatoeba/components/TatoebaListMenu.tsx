import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Menu, Input } from 'semantic-ui-react';
import { inputChangeString } from 'components/util';
import 'App.css';

type TatoebaListMenuProps = {
  keyword: string;
  onSearch: (keyword: string) => void;
};

export const TatoebaListMenu: React.FC<TatoebaListMenuProps> = (
  props: TatoebaListMenuProps
) => {
  const history = useHistory();
  const [keyword, setKeyword] = useState(props.keyword);
  const onImportButtonClick = () => {
    history.push(`/plugin/tatoeba/import`);
  };
  return (
    <Menu vertical fluid>
      <Menu.Item>
        Tatoeba
        <Menu.Menu>
          <Menu.Item>
            <Input
              icon={
                <Icon
                  name="search"
                  inverted
                  circular
                  link
                  onClick={() => props.onSearch(keyword)}
                />
              }
              placeholder="Search..."
              onChange={inputChangeString(setKeyword)}
              value={keyword}
            />
          </Menu.Item>
          <Menu.Item onClick={onImportButtonClick}>
            Import Tatoeba data
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};
