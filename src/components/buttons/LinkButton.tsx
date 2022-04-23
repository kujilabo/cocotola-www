import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

type LinkButtonProps = {
  disabled?: boolean;
  value: string;
  to: string;
};

export const LinkButton: React.FC<LinkButtonProps> = (
  props: LinkButtonProps
) => {
  const [t] = useTranslation();
  return (
    <Link style={{ textDecoration: 'none', color: 'white' }} to={props.to}>
      <Button color="teal" type="button" disabled={props.disabled}>
        {t(props.value)}
      </Button>
    </Link>
  );
};
