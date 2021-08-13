import React from 'react';

import { AppBreadcrumb } from '.';

export const PrivateProblemBreadcrumb: React.FC<PrivateProblemBreadcrumbProps> = (
  props: PrivateProblemBreadcrumbProps
) => {
  return (
    <AppBreadcrumb
      links={[
        { text: 'My Workbooks', url: '/app/private/workbook' },
        { text: props.name, url: '/app/private/workbook/' + props.id },
      ]}
      text={props.text}
    />
  );
};

type PrivateProblemBreadcrumbProps = {
  name: string;
  id: number;
  text: string;
};
