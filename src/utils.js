export const getdomain = () => {
  if (
    window.location.host.includes("127.0.0.1") ||
    window.location.host.includes("localhost")
  )
    return "http://localhost:8080";
  // return "vided-spring-boot-app-bch3adbmgafbesac.centralindia-01.azurewebsites.net:8080";
  else
    return "vided-spring-boot-app-bch3adbmgafbesac.centralindia-01.azurewebsites.net:8080";
};
