/*
 * Created: Tue 22 Feb 2011 06:15:37 PM EST
 * Last Modified: Tue 22 Feb 2011 06:37:51 PM EST
 */

/*!
 * Copyright ( C ) 2010, 2011 Dylon Edwards
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

/**
 * @depends "dllbest.js"
 *
 * In UML-type notation, the methods which MUST be defined for this tree to
 * function are as follows:
 *
 * + addAsChild (  root : DllBest.Node, node : DllBest.Node  ) : void
 * + removeNode (  node : DllBest.Node  ) : void
 */
(function ( window ) {


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        Local Variable Definitions                        ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


var NS = window.DllBest || ( window.DllBest = {} );


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                         DllBest.Tree Constructor                         ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Constructs a new Tree which functions as a BEST tree ( or a Binary Extended
 * Search Tree ).
 *
 * @param {function()} N The generic DllBest.Node type for this tree
 *
 * @param {function( x, y )} compare The function to use when comparing Node
 * instances.  It should be in the generic, UML-like form:
 *
 * + compare ( x : T, y : T ) : int
 * 
 * @constructor
 */
function Tree( N, compare ) {
	this.N = N;
	this.compare = compare;
}

NS.Tree = Tree.inherits( DllBest.Base ).namespace( 'DllBest' ).cname( 'Tree' ).extend({


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                                Delegates                                 ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Compares two Node instances.  This function should return a value < 0 ( zero )
	 * if ( node1 < node2 ), a value > 0 ( zero ) if ( node1 > node2 ), or 0 ( zero ) if
	 * ( node1 = node2 ).
	 *
	 * @param {*} key1 The first value to compare
	 * @param {*} key2 The second value to compare
	 * @return The comparison of node1 with node2
	 */
	compare: null,


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                                Properties                                ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Returns the height ( or number of levels, 1-indexed ) of this Tree.  Should
	 * this method return 0 ( zero ), this Tree is empty.
	 *
	 * @return {number} The height of this Tree
	 */
	height: function () {
		if ( this.root ) {
			return this.root.height;
		}

		return 0;
	},

	/**
	 * Locates and returns the biggest Node in this tree
	 *
	 * @return {Node} The biggest Node branching from node
	 */
	biggest: function () {
		if ( this.root ) {
			return this.findBiggest( this.root );
		}

		return null;
	},

	/**
	 * Locates and returns the smallest Node in this Tree
	 *
	 * @return {Node} The largest Node branching from node
	 */
	smallest: function () {
		if ( this.root ) {
			return this.findSmallest( this.root );
		}

		return null;
	},


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                              Generic Types                               ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/** Generic Type of Node with which this Tree is associated */
	N: null,


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Default Fields                               ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/** Root Node of this Tree */
	root: null,

	/** Number of elements in this Tree */
	elements: 0,


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Instance Methods                             ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Creates and inserts a new Node using the provided value as its value.
	 *
	 * @param {*} key The key to associate with value
	 * @param {*} value The value to assign the new Node
	 */
	tryInsert: function ( key, value ) {
		if ( !this.root ) {
			this.root = new this.N( key, value );
			return true;
		}

		if ( !this.find( key )) {
			this.addAsChild( this.root, new this.N( key, value ));
			this.elements += 1;
			return true;
		}

		return false;
	},

	/**
	 * Puts the given value at the specified key.
	 *
	 * @param {*} key The key to associate with value
	 * @param {*} value The value against which to map key
	 */
	put: function ( key, value ) {
		/*
		 * TODO: When I get things configured correctly, modify this to support
		 * maps and multimaps.
		 */

		var node = this.find( key );

		if ( node ) {
			node.value = value;
		} else {
			this.insert( key, value );
		}

		return this;
	},

	/**
	 * Creates and appends a new Node using the provided value as its value. The
	 * difference between this.insert and this.tryInsert is that this.tryInsert
	 * only adds a new node if there is not one with an equivalent value already
	 * in this Tree.
	 *
	 * @param {*} key The key to associate with value
	 * @param {*} value The value to assign the new Node
	 */
	insert: function ( key, value ) {
		var node = new this.N( key, value );

		if ( this.root ) {
			this.addAsChild( this.root, node );
			this.elements += 1;
		} else {
			this.root = node;
		}

		return this;
	},

	/**
	 * Locates and returns the biggest Node from the given one
	 *
	 * @param {Node=} node The Node at which to begin the traversal
	 * @return {Node} The biggest Node branching from node
	 */
	findBiggest: function ( node ) {
		while ( node.rChild ) {
			node = node.rChild;
		}

		return node;
	},

	/**
	 * Locates and returns the smallest Node from the given one
	 *
	 * @param {Node=} node The Node at which to begin the traversal
	 * @return {Node} The largest Node branching from node
	 */
	findSmallest: function ( node ) {
		while ( node.lChild ) {
			node = node.lChild;
		}

		return node;
	},

	/**
	 * Recursively traverses this Tree in preorder
	 *
	 * @param {Node} node The node at which to begin the traversal
	 * @param {Array.<*>} list The list to which to append the values
	 * @return {Array.<*>} The values of this Tree in preorder
	 */
	preorder: function preorder( node, list ) {
		if ( !node ) { node = this.root; }
		if ( !list ) { list = []; }

		if ( !node ) {
			return list;
		}

		list.push( node.value );

		var next = node;
		while (( next = next.eq )) {
			list.push( next.value );
		}

		if ( node.lChild ) {
			preorder( node.lChild, list );
		}

		if ( node.rChild ) {
			preorder( node.rChild, list );
		}

		return list;
	},

	/**
	 * Recursively traverses this Tree in order
	 *
	 * @param {Node} node The node at which to begin the traversal
	 * @param {Array.<*>} list The list to which to append the values
	 * @return {Array.<*>} The values of this Tree in order
	 */
	inorder: function inorder( node, list ) {
		if ( !node ) { node = this.root; }
		if ( !list ) { list = []; }

		if ( !node ) {
			return list;
		}

		if ( node.lChild ) {
			inorder( node.lChild, list );
		}

		list.push( node.value );

		var next = node;
		while (( next = next.eq )) {
			list.push( next.value );
		}

		if ( node.rChild ) {
			inorder( node.rChild, list );
		}

		return list;
	},

	/**
	 * Recursively traverses this Tree in descending order
	 *
	 * @param {Node} node The node at which to begin the traversal
	 * @param {Array.<*>} list The list to which to append the values
	 * @return {Array.<*>} The values of this Tree in descending order
	 */
	postorder: function postorder( node, list ) {
		if ( !node ) { node = this.root; }
		if ( !list ) { list = []; }

		if ( !node ) {
			return list;
		}

		if ( node.lChild ) {
			postorder( node.lChild, list );
		}

		if ( node.rChild ) {
			postorder( node.rChild, list );
		}

		list.push( node.value );

		var next = node;
		while (( next = next.eq )) {
			list.push( next.value );
		}

		return list;
	},

	/**
	 * Locates the Node in this Tree which corresponds to the specified value.
	 *
	 * @param {*} key The key of the Node to find
	 * @return {Node} The Node with the given key
	 */
	find: function ( key ) {
		return this.findInSubtree( this.root, key );
	},

	/**
	 * Recursively locates the Node in this Tree with the requested value.
	 *
	 * @param {Node} node The Node at which to begin the search
	 * @param {*} key The key of the Node to find
	 *
	 * @return {Node|null} Either the first matching Node or null
	 */
	findInSubtree: function findInSubtree( node, key ) {
		if ( !node ) {
			return null;
		}

		var ineq = this.compare( key, node.key );

		if ( ineq < 0 ) {
			return findInSubtree( node.lChild, key );
		}

		if ( ineq > 0 ) {
			return findInSubtree( node.rChild, key );
		}

		return node;
	},

	/**
	 * Removes the Node corresponding to the given value from this Tree
	 *
	 * @param {*} key The key of the Node to remove
	 * @return Whether the operation was successful
	 */
	remove: function ( key ) {
		var node = this.find( key );

		if ( node ) {
			this.removeNode( node );
			return true;
		}

		return false;
	},

	/**
	 * Returns the range of nodes from this Tree which have values between the
	 * given lower and upper bounds.
	 *
	 * @param {*} lower The lower bound of the range
	 * @param {*} upper The upper bound of the range
	 * @return {Array.<*>} The range of elements which are bounded by the above conditions
	 */
	getRange: function ( lower, upper ) {
		var range = [], curr = this.root, prev, node, comp;

		while ( curr ) {
			comp = this.compare( curr.key, lower );

			if ( comp < 0 ) {
				curr = curr.rChild;
			} else if ( comp > 0 ) {
				prev = curr;
				curr = curr.lChild;
			} else {
				break;
			}
		}

		if ( !curr ) {
			curr = prev;
		}

		while ( curr && ( this.compare( curr.key, upper ) <= 0 )) {
			range.push( curr.value );

			node = curr;
			while (( node = node.eq )) {
				range.push( node.value );
			}

			curr = curr.gt;
		}

		return range;
	},

	/**
	 * Returns an inorder traversal of this Tree according to the doubly-linked list,
	 * rather than the binary search tree.  This is a faster method than the traditional
	 * BST inorder traversal, and is useful for debugging.
	 *
	 * @return {Array.<*>} A list of elements in this Tree in ascending order
	 */
	dlldump: function () {
		var curr = this.smallest(), dump = [], node;

		while ( curr ) {
			dump.push( curr.value );

			node = curr;
			while (( node = node.eq )) {
				dump.push( node.value );
			}

			curr = curr.gt;
		}

		return dump;
	},

	/**
	 * Allows this Tree to function as a priority queue by removing and returning
	 * the value of the greatest node.
	 *
	 * @return {*} The value of the greatest node in this Tree
	 */
	dequeue: function () {
		var node = this.biggest();

		if ( node ) {
			this.removeNode( node );
			return node.value;
		}

		return null;
	}
});

}( window ));

