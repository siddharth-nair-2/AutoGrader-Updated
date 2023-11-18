import React from "react";
import styled from "styled-components";

const HeadingDiv = styled.div`
  color: black;
  font-size: 30px;
  margin: 20px 80px 20px 80px;
  font-weight: 600;
  justify-content: center;
  display: flex;
`;

const Heading = ({ children }) => {
  return <HeadingDiv>{children}</HeadingDiv>;
};

export default Heading;
