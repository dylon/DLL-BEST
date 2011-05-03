( function( $ ) {
    var comparator, Activity, ActivityTable;

    comparator = function( date1, date2 ) {
        return ( date1 > date2 ) ? 1 : ( date1 < date2 ) ? -1 : 0;
    };

    Activity = function( date, hours, customer ) {
        if ( date !== undefined ) { this.date = date; }
        if ( hours !== undefined ) { this.hours = hours; }
        if ( customer !== undefined ) { this.customer = customer; }
    };

    Activity.prototype = {
        date     : new Date().getTime(),
        hours    : 0,
        customer : "(Unknown Customer)",
        
        toTableRow : function( iRow ) {
            return [
                "<tr class='", "row" + (iRow & 1 ), "'>",
                    "<td>", iRow, "</td>",
                    "<td>", this.date, "</td>",
                    "<td>", this.hours.toFixed( 2 ), "</td>",
                    "<td>", this.customer, "</td>",
                "</tr>"
            ].join( "" );
        }
    };

    ActivityTable = function() {
        /// Empty Constructor ///
    };

    ActivityTable.prototype = new DllBest.Avl.Tree( comparator );

    ActivityTable.prototype.getRows = function( activities ) {
        var o, a, i, j;

        o = [];
        for ( i = 0, j = activities.length; i < j; ++ i ) {
            a = activities[ i ];
            o.push( a.toTableRow( i + 1 ));
        }

        return o.join( "" );
    };

    ActivityTable.prototype.getTable = function( activities ) {
        var index = activities.length - 1;
        return [
            "<table id='demo-table'>",
                "<tr>",
                    "<th>Row</th>",
                    "<th>Date</th>",
                    "<th>Hours</th>",
                    "<th>Customer</th>",
                "</tr>",
                this.getRows( activities ),
            "</table>"
        ].join( "" );
    };

    ActivityTable.prototype.showRange = function( lower, upper ) {
        var activities, table, begin, end1, end2;
        
        begin = new Date();
        activities = this.getRange( lower, upper );
        end1 = new Date();

        table = this.getTable( activities );
        end2 = new Date();

        console.log( "{>>>} Total records retrieved: " + activities.length );
        console.log( "{>>>} Time to retrieve records: " + ( end1 - begin ));
        console.log( "{>>>} Time to generate table: " + ( end2 - begin ));

        $( '#demo-table' ).remove();
        $( 'body' ).append( table );
    };

    ActivityTable.prototype.populate = function() {
        var a, c, i, j, d;

        c = [
            "USC Aiken",
            "USC Beaufort", 
            "USC Columbia",
            "USC Lancaster",
            "USC Salkehatchie",
            "USC Sumter",
            "USC Union",
            "USC Upstate"
        ];

        for ( i = 0, j = 20000; i <= j; ++ i ) {
            d = new Date(
                ( 2009 + Math.random() * ( 2013 - 2009 )),
                ( 0 + Math.random() * 12),
                ( 1 + Math.random() * 28 ),
                ( 0 + Math.random() * 23 ),
                ( 0 + Math.random() * 59 ),
                ( 0 + Math.random() * 59 ),
                ( 0 + Math.random() * 999 )
            );

            a = new Activity(
                d.toString(),
                ( 0.5 + Math.random() * 5 ),
                c[ Math.floor( Math.random() * c.length ) ]
            );

            this.insert( d.getTime(), a );
        }
    };

    window.ActivityTable = new ActivityTable();
}( jQuery ));

