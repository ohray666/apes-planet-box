export default function reducer(redux = {}, action) {
  switch (action.type) {
    case "SERVERS_POINT":
      return { ...redux, serversPoint: action.data };
    case "LOCAL_POINT":
      return { ...redux, localPoint: action.data };
    default:
      //   throw new Error("Unexpected action");
      return redux;
  }
}
