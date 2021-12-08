import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Divider,
  Grid,
  Message,
  Pagination,
  PaginationProps,
} from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  findWorkbook,
  selectWorkbookViewLoading,
  selectWorkbookListFailed,
  selectWorkbook,
} from 'features/workbook_view';
import {
  findProblems,
  selectProblemListLoading,
  selectProblemListFailed,
  selectProblemsTotalCount,
  selectProblems,
} from 'features/problem_list';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { WorkbookModel } from 'models/workbook';
import { ProblemModel } from 'models/problem';
import { problemFactory } from 'app/store';
import { ProblemFactory } from '../workbook/problem/ProblemFactory';
import 'App.css';

const WorkbookMenu: React.FC<WorkbookMenuProps> = (
  props: WorkbookMenuProps
) => {
  return props.problemFactory.createMenu(
    props.workbook.problemType,
    props.initStudy,
    props.workbook
  );
};

type WorkbookMenuProps = {
  problemFactory: ProblemFactory;
  workbook: WorkbookModel;
  initStudy: (s: string) => void;
};

//  <Grid.Column mobile={16} tablet={8} computer={8} widescreen={4}>
const WorkbookProblems: React.FC<WorkbookProblemsProps> = (
  props: WorkbookProblemsProps
) => {
  const problems = props.problems.map((p) => {
    const card = props.problemFactory.createReadWriteProblem(
      p.problemType,
      p.id,
      props.workbook.id,
      p
    );
    console.log(card);

    return <Grid.Column>{card}</Grid.Column>;
  });
  console.log(problems);
  return <>{problems}</>;
};

type WorkbookProblemsProps = {
  problemFactory: ProblemFactory;
  workbook: WorkbookModel;
  problems: ProblemModel[];
};

type ParamTypes = {
  _workbookId: string;
};

export function PrivateWorkbookView(): React.ReactElement {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const dispatch = useAppDispatch();
  const workbookViewLoading = useAppSelector(selectWorkbookViewLoading);
  const workbookViewFailed = useAppSelector(selectWorkbookListFailed);
  const problemListLoading = useAppSelector(selectProblemListLoading);
  const problemListFailed = useAppSelector(selectProblemListFailed);
  const problems = useAppSelector(selectProblems);
  const problemsTotalCount = useAppSelector(selectProblemsTotalCount);
  const workbook = useAppSelector(selectWorkbook);
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => {
    return;
  };
  const onPageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    data: PaginationProps
  ) => {
    const pageNo = +(data.activePage || 0);
    console.log(pageNo);
  };

  useEffect(() => {
    dispatch(
      findWorkbook({
        param: { id: workbookId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
    dispatch(
      findProblems({
        workbookId: workbookId,
        param: {
          pageNo: 1,
          pageSize: 10,
          keyword: '',
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, workbookId]);

  if (workbookViewFailed || problemListFailed) {
    return <div></div>;
  }

  const loading = workbookViewLoading || problemListLoading;

  let totalPages = Math.floor(problemsTotalCount / 10);
  const mod = problemsTotalCount % 10;
  if (mod !== 0) {
    totalPages++;
  }

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[{ text: 'My Workbooks', url: '/app/private/workbook' }]}
        text={workbook.name}
      />
      <Divider hidden />
      <Grid>
        <Grid.Row>
          {loading ? <AppDimmer /> : <div />}
          <Grid.Column mobile={16} tablet={16} computer={3}>
            <WorkbookMenu
              problemFactory={problemFactory}
              workbook={workbook}
              initStudy={(_) => {
                console.log('initstudy');
              }}
            ></WorkbookMenu>
            <Divider hidden />
          </Grid.Column>
          {problems.length > 0 ? (
            <Grid.Column mobile={16} tablet={16} computer={13}>
              <Grid doubling columns={3}>
                {/* <Grid.Row> */}
                <WorkbookProblems
                  problemFactory={problemFactory}
                  workbook={workbook}
                  problems={problems || []}
                  // getAudio={getAudio}
                  // removeProblem={removeProblem}
                />
                {/* </Grid.Row> */}
                <Grid.Row>
                  <Grid.Column>
                    <Container textAlign="center">
                      <Pagination
                        onPageChange={onPageChange}
                        defaultActivePage={1}
                        totalPages={totalPages}
                      />
                    </Container>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          ) : (
            <Grid.Column mobile={16} tablet={16} computer={13}>
              <Message info>
                <Message.Header>Problems are not registered.</Message.Header>
                <p>
                  Please click{' '}
                  <Link to={`/app/workbook/${_workbookId}/problem/new`}>
                    New problem
                  </Link>{' '}
                  to register a new problem.
                </p>
              </Message>
              <ErrorMessage message={errorMessage} />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
}
