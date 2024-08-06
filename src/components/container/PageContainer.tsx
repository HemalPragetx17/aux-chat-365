type Props = {
  children: any | JSX.Element | JSX.Element[];
  style?: any;
};

const PageContainer = ({ children, style }: Props) => (
  <div style={style}>{children}</div>
);

export default PageContainer;
