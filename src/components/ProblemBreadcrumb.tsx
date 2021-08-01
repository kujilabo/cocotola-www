import React from 'react';

import { AppBreadcrumb } from '.';

export const ProblemBreadcrumb: React.FC<ProblemBreadcrumbProps> = (
  props: ProblemBreadcrumbProps
) => {
  return (
    <AppBreadcrumb
      links={[
        { text: 'Workbooks', url: '/app/workbook' },
        { text: props.name, url: '/app/workbook/' + props.id },
      ]}
      text={props.text}
    />
  );
};

type ProblemBreadcrumbProps = {
  name: string;
  id: number;
  text: string;
};
