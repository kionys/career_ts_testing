import { pageRoutes } from '@/apiRoutes';
import { NotFoundPage } from '@/pages/error/components/NotFoundPage';
import render from '@/utils/test/render';
import { screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

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

it('Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다', async () => {
  // Arrange: NotFoundPage 컴포넌트를 렌더링
  const { user } = await render(<NotFoundPage />);

  // Act: "Home으로 이동" 버튼 클릭
  const homeButton = screen.getByText('Home으로 이동');
  await user.click(homeButton);

  // Assert: navigate 함수가 '/'와 { replace: true }로 호출되었는지 확인
  const navigate = useNavigate(); // 모킹된 함수 호출
  expect(navigate).toHaveBeenCalledWith(pageRoutes.main, { replace: true });
});
