import React from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Input } from 'semantic-ui-react';

import { WorkbookModel } from 'models/workbook';
import 'App.css';

export const EnglishWordProblemMenu: React.FC<EnglishWordProblemMenuProps> = (
  props: EnglishWordProblemMenuProps
) => {
  const history = useHistory();
  const studyButtonClicked = (studyType: string) => {
    props.initStudy('');
    history.push(`/app/workbook/${props.workbook.id}/study/${studyType}`);
  };
  const onImportButtonClick = () => {
    history.push(`/app/private/workbook/${props.workbook.id}/import`);
  };

  if (props.workbook.subscribed) {
    return (
      <Menu vertical fluid>
        <Menu.Item>
          Study
          <Menu.Menu>
            <Menu.Item onClick={() => studyButtonClicked('memorization')}>
              Memorization
            </Menu.Item>
            <Menu.Item onClick={() => studyButtonClicked('dictation')}>
              Dictation
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu vertical fluid>
        <Menu.Item>
          Study
          <Menu.Menu>
            <Menu.Item onClick={() => studyButtonClicked('memorization')}>
              Memorization
            </Menu.Item>
            <Menu.Item onClick={() => studyButtonClicked('dictation')}>
              Dictation
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          Problems
          <Menu.Menu>
            <Menu.Item>
              <Input placeholder="Search..." />
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                history.push(`/app/private/workbook/${props.workbook.id}/problem/new`);
              }}
            >
              New problem
            </Menu.Item>
            <Menu.Item onClick={onImportButtonClick}>Import problems</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          Workbook settings
          <Menu.Menu>
            <Menu.Item
              onClick={() =>
                history.push(`/app/private/workbook/${props.workbook.id}/edit`)
              }
            >
              Edit workbook
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
};
type EnglishWordProblemMenuProps = {
  initStudy: (s: string) => void;
  workbook: WorkbookModel;
};
