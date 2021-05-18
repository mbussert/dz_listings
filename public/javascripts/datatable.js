$(document).ready(function() {
  $.getJSON('/listings/get_tags_ar', function(result) {
    // result.tags = result.tags.map(arr => {
    //   return {col1: arr[0], col2: arr[1], col3: arr[2]
    // }})
    const events = $('#events');
    const table = $('#table_id').DataTable(
        {
          select: true,
          searchPanes: {
            cascadePanes: true,
          },
          data: result.tags,
          dom: 'Plfrtip',
          // data: dataSet,
          columns: [
            {title: 'Category_1'},
            {title: 'Category_2'},
            {title: 'Category_3'},
          ],
          columnDefs: [{
            targets: '_all',
            searchPanes: {
              show: true,
            },
          }],
        },
    );
    table
        .on('select', function(e, dt, type, indexes) {
          const rowData = table.rows(indexes).data().toArray();
          events.val( rowData[0][2] );
        // events.prepend( rowData[2] );
        });
  });
});

