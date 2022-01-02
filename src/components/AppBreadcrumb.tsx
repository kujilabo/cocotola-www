import React from 'react';
import { useHistory } from 'react-router-dom';

import { Breadcrumb, Segment } from 'semantic-ui-react';
import { createMedia } from '@artsy/fresnel';

import 'App.css';

export class AppBreadcrumbLink {
  url: string;
  text: string;

  constructor(url: string, text: string) {
    this.url = url;
    this.text = text;
  }
}
const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});
const { Media } = AppMedia;

export const AppBreadcrumb = (props: {
  links: AppBreadcrumbLink[];
  text: string;
}): React.ReactElement => {
  const history = useHistory();

  // onsole.log('links', props.links);

  const breadcrumb = (
    <Breadcrumb size="large">
      <Breadcrumb.Section link onClick={() => history.push('/')}>
        Home
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
      {props.links.map((link: AppBreadcrumbLink) => {
        return (
          <Breadcrumb.Section
            key={link.url}
            link
            onClick={() => history.push(link.url)}
          >
            {link.text}
            <Breadcrumb.Divider />
          </Breadcrumb.Section>
        );
      })}
      <Breadcrumb.Section active>{props.text}</Breadcrumb.Section>
    </Breadcrumb>
  );

  return (
    <Segment vertical as={Media} at="computer">
      {breadcrumb}
    </Segment>
  );
};
