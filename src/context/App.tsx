
import { CreateUser, WebApi } from '../component';
import { useUser } from './userContext';
export const DATA: any = {
  App: null,
  Head: null,
  useRouter: null
}
function MyApp(page: any) {
  CreateUser(page.data)
  return (<div className='container-fluid'>
    <div>
      <DATA.Head>
        <title>TOMRIS WEB PAGE - {page.router.pathname} {useUser().user.token}</title>
      </DATA.Head>
    </div>
    <page.Component {...page.pageProps} />
  </div>)
}

MyApp.getInitialProps = async (appContext: any) => {



  let token=  appContext.ctx.req?.headers["token"];

  const appProps = await DATA.App.getInitialProps(appContext);
  
  let user = (appContext.router.query["user"] ?? "") as string;
  let users = {
    page: user,
    user: {
      userId: user,
      token: token
    }, 
  };
  return {
    ...appProps, pages: Object.keys(appContext), data: users
  }
}

export default MyApp
