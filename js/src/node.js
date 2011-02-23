/*
 * Created: Tue 22 Feb 2011 06:15:05 PM EST
 * Last Modified: Tue 22 Feb 2011 06:30:09 PM EST
 */

/*!
 * Copyright ( C ) 2010 Dylon Edwards
 *
 * @depends "dllbest.js"
 *
 * This code is available under MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files ( the "Software" ), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*global window */

(function ( window ) {


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        DllBest.Node Constructor                          ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Constructs a new Node to insert into the corresponding Avl Tree.
 *
 * @param {*} key The key to associate with value
 * @param {*} value The key to associate with this Node
 * @constructor
 */
function Node( key, value ) {
	this.key = key;
	this.value = value;
}

Node.inherits( DllBest.Base ).namespace( 'DllBest' ).cname( 'Node' ).extend({


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                              Default Fields                              ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	lChild : null,
	rChild : null,
	height : 0,

	lt : null,
	gt : null,
	eq : null,


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Instance Methods                             ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Assigns the values of the given Node to this one
	 *
	 * @param {Node} node The node whose properties to assume
	 * @param {boolean} key Whether to accept node's value as well
	 */
	assign: function ( node, key ) {
		this.lChild = node.lChild;
		this.rChild = node.rChild;
		this.height = node.height;

		if ( key ) {
			this.key = node.key;
			this.value = node.value;
			this.eq = node.eq;
		}

		this.lt = node.lt;
		this.gt = node.gt;
		
		if ( this.lt ) {
			this.lt.gt = this;
		}

		if ( this.gt ) {
			this.gt.lt = this;
		}
	},


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Override Methods                             ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Returns a string representation for this Node, which is suitable for printing.
	 *
	 * @return {string} A string representation of this Node
	 */
	toString: function () {
		return '( ' + this.key + ' )';
	}
});

}( window ));

