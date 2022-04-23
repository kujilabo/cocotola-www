import React from 'react';
import { Link } from 'react-router-dom';

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
  // onsole.log('links', props.links);

  const breadcrumb = (
    <Breadcrumb size="large">
      <Breadcrumb.Section>
        <Link to={'/'}>Home</Link>
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
      {props.links.map((link: AppBreadcrumbLink) => {
        return (
          <Breadcrumb.Section key={link.url}>
            <Link to={link.url}>{link.text}</Link>
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
