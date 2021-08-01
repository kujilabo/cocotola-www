import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Container, Divider, Grid, Menu } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  findMyWorkbooks,
  selectWorkbooksLoadedMap,
  selectWorkbookListFailed,
  selectWorkbookListLoading,
  selectWorkbooksMap,
} from 'features/workbook_list';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { WorkbookCard } from 'components/workbook/WorkbookCard';
import { useDidMount } from 'components/util';
import { WorkbookModel } from 'models/workbook';
import 'App.css';

export function PrivateWorkbookList(): React.ReactElement {
  const dispatch = useAppDispatch();
  const spaceKey = 'personal';
  const basePath = '/app/private/workbook/';
  const history = useHistory();
  const workbookListLoading = useAppSelector(selectWorkbookListLoading);
  const workbookListFailed = useAppSelector(selectWorkbookListFailed);
  const workbooksLoadedMap = useAppSelector(selectWorkbooksLoadedMap);
  const workbooksMap = useAppSelector(selectWorkbooksMap);
  const [errorMessage, setErrorMessage] = useState('');
  const workbooksLoaded = workbooksLoadedMap[spaceKey] || false;
  const emptyFunction = () => { return; };
  console.log('workbooksLoaded', workbooksLoaded);
  console.log('workbooksLoaded', workbooksLoadedMap);

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

  if (!workbookListFailed && !workbookListLoading && !workbooksLoaded) {
    console.log('loading');
    return <div>loading</div>;
  }

  const workbooks = workbooksMap[spaceKey] || [];
  console.log('props.loading', workbookListLoading);
  return (
    <Container fluid>
      <AppBreadcrumb links={[]} text={'My Workbooks'} />
      <Divider hidden />
      <Grid>
        <Grid.Row>
          {workbookListLoading ? <AppDimmer /> : <div />}
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
}
