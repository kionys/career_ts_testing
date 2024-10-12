import { pageRoutes } from '@/apiRoutes';
import customRender from '@/utils/test/render';
import { screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import { EmptyNotice } from '../EmptyNotice';

// react-router-dom을 MemoryRouter로 모킹하기
type ReactRouterDOMType = typeof import('react-router-dom');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: ReactRouterDOMType = await importOriginal();

  // useNavigate에 대한 모킹 생성
  const mockNavigate = vi.fn();

  return {
    ...actual,
    MemoryRouter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useNavigate: () => mockNavigate, // 모킹된 함수 반환
  };
});

it('"홈으로 가기" 링크를 클릭할 경우 "/" 경로로 navigate 함수가 호출된다', async () => {
  // Arrange: EmptyNotice 컴포넌트를 렌더링
  const { user } = await customRender(<EmptyNotice />);

  // Act: "홈으로 가기" 버튼 클릭
  const homeLink = screen.getByText('홈으로 가기');
  await user.click(homeLink);

  // Assert: navigate 함수가 '/' 경로로 호출되었는지 확인
  const navigate = useNavigate(); // 모킹된 navigate 함수 가져오기
  expect(navigate).toHaveBeenCalledWith(pageRoutes.main);
});
