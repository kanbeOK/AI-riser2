// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

function openRoute(route: string) {
  window.history.pushState({}, "", route);
  render(<App />);
}

describe("real player click paths", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("finishes the 90-second demo through the visible investigation UI", () => {
    openRoute("/game?mode=demo");

    expect(screen.getByText("Đơn hàng 250K")).toBeTruthy();
    expect(screen.getByText("Shipper bị hiểu lầm")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Niêm phong SIM giao hàng" }));
    fireEvent.click(screen.getByRole("button", { name: "Mở hồ sơ" }));
    fireEvent.click(screen.getByRole("button", { name: "Cảnh báo nạn nhân" }));

    expect(screen.getByRole("heading", { name: "Demo hoàn tất" })).toBeTruthy();
    expect(screen.getByText("Bạn đã biến một tín hiệu rời rạc thành quyết định có căn cứ.")).toBeTruthy();
  });

  it("plays a solo night from the apartment, resolves a case and reaches day two", () => {
    vi.useFakeTimers();
    openRoute("/game?mode=solo");

    fireEvent.click(screen.getByRole("button", { name: "Vào ca trực" }));
    fireEvent.click(screen.getByRole("button", { name: /Bắt đầu ca trực/ }));

    act(() => {
      vi.advanceTimersByTime(4_200);
    });

    fireEvent.click(screen.getByRole("button", { name: "Niêm phong SIM giao hàng" }));
    fireEvent.click(screen.getByRole("button", { name: "Mở hồ sơ" }));
    fireEvent.click(screen.getByRole("button", { name: "Cảnh báo nạn nhân" }));
    fireEvent.click(screen.getByRole("button", { name: "Đóng công cụ điều tra" }));
    fireEvent.click(screen.getByRole("button", { name: "Kết thúc ca" }));

    fireEvent.click(screen.getByRole("button", { name: "Ngủ" }));
    fireEvent.click(screen.getByRole("button", { name: "Ngủ sang ngày mới" }));

    expect(screen.getByText("CĂN HỘ 404 / ĐÊM 2")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Bàn" }));
    fireEvent.click(screen.getByRole("button", { name: "Vào ca trực" }));
    expect(screen.getByRole("heading", { name: /Đêm 2:/ })).toBeTruthy();
    expect(screen.getByText("Cộng tác viên hoa hồng")).toBeTruthy();
    expect(screen.getByText("Tổng đài khóa tài khoản")).toBeTruthy();
  });
});
