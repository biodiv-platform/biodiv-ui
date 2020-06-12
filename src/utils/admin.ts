export const getAdminUser = (adminList) => {
  const idsList = [],
    emailList = [];
  if (adminList && adminList.length > 0) {
    adminList.map((item) => {
      if (item.__isNew__) {
        emailList.push(item.value);
      } else {
        idsList.push(item.value);
      }
    });
  }
  return { idsList, emailList };
};
