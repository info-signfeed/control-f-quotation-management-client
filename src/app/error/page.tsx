export default function ErrorPage({ searchParams }: any) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Error</h1>
      <p>{searchParams.msg || 'Something went wrong'}</p>
    </div>
  )
}
