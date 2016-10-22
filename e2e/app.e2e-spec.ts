import { CiklumFinalPage } from './app.po';

describe('ciklum-final App', function() {
  let page: CiklumFinalPage;

  beforeEach(() => {
    page = new CiklumFinalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
