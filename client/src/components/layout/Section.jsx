import React from "react";
import Container from "./Container";

const Section = ({ children, className = "", containerClassName = "" }) => {
  return (
    <section className={`py-10 sm:py-12 lg:py-16 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
};

export default Section;
