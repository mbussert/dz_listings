$(document).ready(function () {
  $.getJSON("/listings/get_tags", function (result) {
    // result.tags = result.tags.map(arr => { return {col1: arr[0], col2: arr[1], col3: arr[2]}})
    $('#table_id').DataTable(
      {
        searchPanes: {
          cascadePanes: true
        },
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
    var table = $('#table_id').DataTable();
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
      var cell = table.cell({ row: rowIdx, column: 2 }).node();
      $(cell).addClass('tags');
    });
  });
});

