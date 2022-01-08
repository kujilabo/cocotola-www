import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Container, Divider, Grid, Menu } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  findMyWorkbooks,
  selectWorkbooksLoadedMap,
  selectWorkbookFindFailed,
  selectWorkbookFindLoading,
  selectWorkbooksMap,
} from 'features/workbook_find';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { WorkbookCard } from 'components/workbook/WorkbookCard';
import { useDidMount } from 'components/util';
import { WorkbookModel } from 'models/workbook';
import { emptyFunction } from 'utils/util';
import 'App.css';

export const PrivateWorkbookList = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const spaceKey = 'personal';
  const basePath = '/app/private/workbook/';
  const history = useHistory();
  const workbookFindLoading = useAppSelector(selectWorkbookFindLoading);
  const workbookFindFailed = useAppSelector(selectWorkbookFindFailed);
  const workbooksLoadedMap = useAppSelector(selectWorkbooksLoadedMap);
  const workbooksMap = useAppSelector(selectWorkbooksMap);
  const [errorMessage, setErrorMessage] = useState('');
  const workbooksLoaded = workbooksLoadedMap[spaceKey] || false;
  // onsole.log('workbooksLoaded', workbooksLoaded);
  // onsole.log('workbooksLoaded', workbooksLoadedMap);

  useDidMount(() => {
    dispatch(
      findMyWorkbooks({
        param: {
          pageNo: 1,
          pageSize: 10,
          spaceKey: spaceKey,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  });

  if (!workbookFindFailed && !workbookFindLoading && !workbooksLoaded) {
    return <AppDimmer />;
  }

  const workbooks = workbooksMap[spaceKey] || [];
  return (
    <Container fluid>
      <AppBreadcrumb links={[]} text={'My Workbooks'} />
      <Divider hidden />
      <Grid>
        <Grid.Row>
          {workbookFindLoading ? <AppDimmer /> : <div />}
          <Grid.Column mobile={16} tablet={16} computer={3}>
            <Menu vertical fluid>
              <Menu.Item>
                <Input placeholder="Search..." />
              </Menu.Item>

              <Menu.Item onClick={() => history.push(`${basePath}new`)}>
                New workbook
              </Menu.Item>
            </Menu>
            <Divider hidden />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            {workbooks.map((w: WorkbookModel) => {
              return (
                <WorkbookCard
                  key={w.id}
                  basePath={basePath}
                  model={w}
                ></WorkbookCard>
              );
            })}
            <ErrorMessage message={errorMessage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
