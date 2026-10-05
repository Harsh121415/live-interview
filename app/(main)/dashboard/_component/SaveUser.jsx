import React from "react";
import { currentUser } from "@clerk/nextjs/server";

async function SaveUser({ setLoggedUser }) {
  const user = await currentUser();
  return <></>;
}

export default SaveUser;
