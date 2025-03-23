import { Navigate } from 'react-router'

const NotFound = () => {
  return <Navigate to="/" replace />
  // return (
  //   <div className="flex h-screen flex-col items-center justify-center bg-background px-4 text-center">
  //     <h1 className="text-6xl font-bold text-primary">404</h1>
  //     <p className="mt-4 text-xl text-gray-500">
  //       Oops! The page you're looking for doesn't exist.
  //     </p>
  //     <Button
  //       as={Link}
  //       to="/"
  //       color="primary"
  //       variant="shadow"
  //       className="mt-6"
  //     >
  //       Go Back Home
  //     </Button>
  //   </div>
  // )
}

export default NotFound
