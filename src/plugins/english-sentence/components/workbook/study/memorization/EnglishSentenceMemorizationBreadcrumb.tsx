import React from 'react';

import { AppBreadcrumb, AppBreadcrumbLink } from 'components';

export const EnglishSentenceMemorizationBreadcrumb: React.FC<EnglishSentenceMemorizationBreadcrumbProps> = (
  props: EnglishSentenceMemorizationBreadcrumbProps
) => {
  const links = [...props.breadcrumbLinks];
  links.push(new AppBreadcrumbLink(props.workbookUrl + props.id, props.name,));
  return (
    <AppBreadcrumb
      links={links}
      text={'Memorization'}
    />
  );
};
type EnglishSentenceMemorizationBreadcrumbProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
  name: string;
  id: number;
};
