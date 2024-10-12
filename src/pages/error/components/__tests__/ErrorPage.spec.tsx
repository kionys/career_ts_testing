import render from '@/utils/test/render';
import { screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import { ErrorPage } from '../ErrorPage';

// react-router-dom을 MemoryRouter로 모킹하기
type ReactRouterDOMType = typeof import('react-router-dom');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: ReactRouterDOMType = await importOriginal();

  const mockNavigate = vi.fn(); // 모킹된 navigate 함수 생성

  return {
    ...actual,
    MemoryRouter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useNavigate: () => mockNavigate, // 모킹된 함수 반환
  };
});

it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  // Arrange: ErrorPage 컴포넌트를 렌더링
  const { user } = await render(<ErrorPage />);

  // Act: "뒤로 이동" 버튼 클릭
  const backButton = screen.getByText('뒤로 이동');
  await user.click(backButton);

  // Assert: navigate 함수가 -1 인자로 호출되었는지 확인
  expect(useNavigate()).toHaveBeenCalledWith(-1); // 모킹된 함수 직접 사용
});
