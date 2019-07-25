import React from "react";
import { shallow } from "enzyme";
import Home from "../home";

// enzyme-react-intl: A complimentary wrapper function for use with Enzyme, when testing React components that rely on react-intl, see https://github.com/joetidee/enzyme-react-intl

describe("To do Test:", () => {
  it("should render home", () => {
    expect(1 + 1).toBe(2);
    const wrapper = shallow(<Home />);
    console.log(wrapper.find('.home').debug());
    expect(wrapper.find('.home').exists());
    expect(wrapper.find('.home')).toHaveLength(1);
  });
});
