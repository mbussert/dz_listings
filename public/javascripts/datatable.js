$(document).ready(function () {
  $.getJSON("/listings/get_tags", function (result) {
    // result.tags = result.tags.map(arr => { return {col1: arr[0], col2: arr[1], col3: arr[2]}})
    $('#table_id').DataTable(
      {
        data: result.tags,
        dom: 'Plfrtip',
        // data: dataSet,
        columns: [
          { title: "Category_1" },
          { title: "Category_2" },
          { title: "Category_3" }
        ],
        columnDefs: [{
          targets: '_all',
          searchPanes: {
            show: true
          }
        }]
      }
    );
  });
});

