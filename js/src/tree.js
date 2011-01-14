/*!
 * Copyright (C) 2010 Dylon Edwards
 *
 * This code is available under MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
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

'use strict';

/*global window */

/**
 * @depends "dllbest.js"
 *
 * In UML-type notation, the methods which MUST be defined for this tree to
 * function are as follows:
 *
 * + addAsChild ( root : DllBest.Node, node : DllBest.Node ) : void
 * + removeNode ( node : DllBest.Node ) : void
 */
(function(window) {


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        Local Variable Definitions                        ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


var NS = window.DllBest || (window.DllBest = {});


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                         DllBest.Tree Constructor                         ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Constructs a new Tree which functions as a BEST tree (or a Binary Extended
 * Search Tree).
 *
 * @param {function()} N The generic DllBest.Node type for this tree
 *
 * @param {function(x,y)} compare The function to use when comparing Node
 * instances.  It should be in the generic, UML-like form:
 *
 * + compare ( x : T, y : T ) : int
 * 
 * @constructor
 */
function Tree(N, compare) {
	this.N = N;
	this.compare = compare;
}

NS.Tree = Tree.inherits(DllBest.Base).extend({


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                                Delegates                                 ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Compares two Node instances.  This function should return a value < 0 (zero)
	 * if (node1 < node2), a value > 0 (zero) if (node1 > node2), or 0 (zero) if
	 * (node1 = node2).
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
	 * Returns the height (or number of levels, 1-indexed) of this Tree.  Should
	 * this method return 0 (zero), this Tree is empty.
	 *
	 * @return {number} The height of this Tree
	 */
	height: function() {
		if (this.root) {
			return this.root.height;
		}

		return 0;
	},

	/**
	 * Locates and returns the biggest Node in this tree
	 *
	 * @return {Node} The biggest Node branching from node
	 */
	biggest: function() {
		if (this.root) {
			return this.findBiggest(this.root);
		}

		return null;
	},

	/**
	 * Locates and returns the smallest Node in this Tree
	 *
	 * @return {Node} The largest Node branching from node
	 */
	smallest: function() {
		if (this.root) {
			return this.findSmallest(this.root);
		}

		return null;
	},


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                              Generic Types                               ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


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
	 * @param {*} value The value to assign the new Node
	 */
	tryInsert: function(value) {
		if (!this.root) {
			this.root = new this.N(value);
			return true;
		}

		if (!this.find(value)) {
			this.addAsChild(this.root, new this.N(value));
			this.elements += 1;
			return true;
		}

		return false;
	},

	/**
	 * Creates and appends a new Node using the provided value as its value. The
	 * difference between this.append and this.tryInsert is that this.tryInsert
	 * only adds a new node if there is not one with an equivalent value already
	 * in this Tree.
	 *
	 * @param {*} value The value to assign the new Node
	 */
	append: function(value) {
		var node = new this.N(value);

		if (this.root) {
			this.addAsChild(this.root, node);
			this.elements += 1;
		} else {
			this.root = node;
		}
	},

	/**
	 * Locates and returns the biggest Node from the given one
	 *
	 * @param {Node=} node The Node at which to begin the traversal
	 * @return {Node} The biggest Node branching from node
	 */
	findBiggest: function(node) {
		while (node.rChild) {
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
	findSmallest: function(node) {
		while (node.lChild) {
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
	preorder: function rec(node, list) {
		if (!node) { node = this.root; }
		if (!list) { list = []; }

		if (!node) {
			return list;
		}

		list.push(node.value);

		var next = node;
		while ((next = next.eq)) {
			list.push(next.value);
		}

		if (node.lChild) {
			rec(node.lChild, list);
		}

		if (node.rChild) {
			rec(node.rChild, list);
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
	inorder: function rec(node, list) {
		if (!node) { node = this.root; }
		if (!list) { list = []; }

		if (!node) {
			return list;
		}

		if (node.lChild) {
			rec(node.lChild, list);
		}

		list.push(node.value);

		var next = node;
		while ((next = next.eq)) {
			list.push(next.value);
		}

		if (node.rChild) {
			rec(node.rChild, list);
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
	postorder: function rec(node, list) {
		if (!node) { node = this.root; }
		if (!list) { list = []; }

		if (!node) {
			return list;
		}

		if (node.lChild) {
			rec(node.lChild, list);
		}

		if (node.rChild) {
			rec(node.rChild, list);
		}

		list.push(node.value);

		var next = node;
		while ((next = next.eq)) {
			list.push(next.value);
		}

		return list;
	},

	/**
	 * Locates the Node in this Tree which corresponds to the specified value.
	 *
	 * @param {*} value The value with which to retrieve the corresponding Node.
	 * @return {Node} The Node with the given value
	 */
	find: function(value) {
		return this.findInSubtree(this.root, value);
	},

	/**
	 * Recursively locates the Node in this Tree with the requested value.
	 *
	 * @param {Node} node The Node at which to begin the search
	 * @param {*} value The desired value of the sought after Node
	 * @return {Node|null} Either the first matching Node or null
	 */
	findInSubtree: function rec(node, value) {
		if (!node) {
			return null;
		}

		var ineq = this.compare(value, node.value);

		if (ineq < 0) {
			return rec(node.lChild, value);
		}

		if (ineq > 0) {
			return rec(node.rChild, value);
		}

		return node;
	},

	/**
	 * Removes the Node corresponding to the given value from this Tree
	 *
	 * @param {*} value The value corresponding to the Node to remove
	 * @return Whether the operation was successful
	 */
	remove: function(value) {
		var node = this.find(value);

		if (node) {
			this.removeNode(node);
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
	getRange: function(lower, upper) {
		var range = [], curr = this.root, node, comp;

		while (curr) {
			comp = this.compare(curr.value, lower);

			if (comp < 0) {
				curr = curr.rChild;
			} else if ((comp > 0) && curr.lChild) {
				curr = curr.lChild;
			} else {
				break;
			}
		}

		while (curr && (this.compare(curr.value, upper) <= 0)) {
			range.push(curr.value);

			node = curr;
			while ((node = node.eq)) {
				range.push(node.value);
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
	dlldump: function() {
		var curr = this.smallest(), dump = [], node;

		while (curr) {
			dump.push(curr.value);

			node = curr;
			while ((node = node.eq)) {
				dump.push(node.value);
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
	dequeue: function() {
		var node = this.biggest();

		if (node) {
			this.removeNode(node);
			return node.value;
		}

		return null;
	}
});

}(window));

