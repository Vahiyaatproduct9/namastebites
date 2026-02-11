import { Usable, use } from "react"

export default ({ params }: { params: Usable<{ item: string }> }) => {
  const { item } = use<{ item: string }>(params)
  return (
    <>
      <h1 style={{ color: "white", position: "fixed", top: "50px", left: "50px" }}>{item}</h1>
    </>
  )
}