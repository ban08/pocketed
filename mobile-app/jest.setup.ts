import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-svg", () => {
  // Keep icon-heavy screens cheap and deterministic in React Native tests.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");

  const SvgMock = ({ children, ...props }: any) =>
    React.createElement(View, props, children);

  return {
    __esModule: true,
    default: SvgMock,
    Svg: SvgMock,
    Path: SvgMock,
    Circle: SvgMock,
    Rect: SvgMock,
    Line: SvgMock,
  };
});

if (typeof global.fetch === "undefined") {
  global.fetch = jest.fn();
}
