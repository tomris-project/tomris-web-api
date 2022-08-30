
import { CreateUser, WebApi } from '../components'; 
import { useUser } from './userContext';
export const DATA:any={
    App:null,
    Head:null,
    useRouter:null
} 
function MyApp(page: any) { 
  CreateUser(page.data) 
  return (<div className='container-fluid'> 
   <div>
      <DATA.Head>
        <title>TOMRIS WEB PAGE - {page.router.pathname} {useUser().user.userId}</title>
      </DATA.Head> 
    </div>
    <page.Component {...page.pageProps} />
  </div>) 
}

MyApp.getInitialProps = async (appContext: any) => { 
  const appProps = await DATA.App.getInitialProps(appContext);   
  let user=(appContext.router.query["user"]??"") as string;
  let users={
    page: user,
    user:{
      userId:user,
      token:user
    },
   // header:appContext.ctx.req.headers
  };
  return {
    ...appProps, pages: Object.keys(appContext), data: users
  }
}

export default MyApp
