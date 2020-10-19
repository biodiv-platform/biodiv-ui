export const preProcessContent = ({ content, ...rest }) => ({
  ...rest,
  content: content
    .replace(/\<table/g, '<div class="table-responsive"><table')
    .replace(/\<\/table\>/g, "</table></div>")
});
