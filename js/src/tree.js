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
 * @param {function} N The generic DllBest.Node type for this tree
 *
 * @param {function} compare The function to use when comparing Node
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
 * @param {*} key1 The first key to compare
 * @param {*} key2 The second key to compare
 * @return The comparison of node1 with node2
 */
Tree.prototype.compare = null;


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
Tree.prototype.height = function() {
	if (this.root) {
		return this.root.height;
	}

	return 0;
};

/**
 * Locates and returns the biggest Node in this tree
 *
 * @return {Node} The biggest Node branching from node
 */
Tree.prototype.biggest = function() {
	if (this.root) {
		return this.findBiggest(this.root);
	}

	return this.null;
};

/**
 * Locates and returns the smallest Node in this Tree
 *
 * @return {Node} The largest Node branching from node
 */
Tree.prototype.smallest = function() {
	if (this.root) {
		return this.findSmallest(this.root);
	}

	return null;
};


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                              Generic Types                               ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


Tree.prototype.N = null;


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                             Default Fields                               ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/** Root Node of this Tree */
Tree.prototype.root = null;

/** Number of elements in this Tree */
Tree.prototype.elements = 0;


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                             Instance Methods                             ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Creates and inserts a new Node using the provided key as its value.
 *
 * @param {*} key The key to assign the new Node
 */
Tree.prototype.tryInsert = function(key) {
	if (!this.root) {
		this.root = new this.N(key);;
		return true;
	}

	if (!this.find(key)) {
		this.addAsChild(this.root, new this.N(key));
		this.elements += 1;
		return true;
	}

	return false;
};

/**
 * Creates and appends a new Node using the provided key as its value. The
 * difference between this.append and this.tryInsert is that this.tryInsert
 * only adds a new node if there is not one with an equivalent value already
 * in this Tree.
 *
 * @param {*} key The key to assign the new Node
 */
Tree.prototype.append = function(key) {
	var node = new this.N(key);

	if (this.root) {
		this.addAsChild(this.root, node);
		this.elements += 1;
	} else {
		this.root = node;
	}
};

/**
 * Locates and returns the biggest Node from the given one
 *
 * @param {Node=} node The Node at which to begin the traversal
 * @return {Node} The biggest Node branching from node
 */
Tree.prototype.findBiggest = function(node) {
	while (node.rChild) {
		node = node.rChild;
	}

	return node;
};

/**
 * Locates and returns the smallest Node from the given one
 *
 * @param {Node=} node The Node at which to begin the traversal
 * @return {Node} The largest Node branching from node
 */
Tree.prototype.findSmallest = function(node) {
	while (node.lChild) {
		node = node.lChild;
	}

	return node;
};

/**
 * Recursively traverses this Tree in preorder
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this Tree in preorder
 */
Tree.prototype.preorder = function rec(node, list) {
	if (!node) { node = this.root; }
	if (!list) { list = []; }

	if (!node) {
		return list;
	}

	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	if (node.lChild) {
		rec(node.lChild, list);
	}

	if (node.rChild) {
		rec(node.rChild, list);
	}

	return list;
};

/**
 * Recursively traverses this Tree in order
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this Tree in order
 */
Tree.prototype.inorder = function rec(node, list) {
	if (!node) { node = this.root; }
	if (!list) { list = []; }

	if (!node) {
		return list;
	}

	if (node.lChild) {
		rec(node.lChild, list);
	}

	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	if (node.rChild) {
		rec(node.rChild, list);
	}

	return list;
};

/**
 * Recursively traverses this Tree in descending order
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this Tree in descending order
 */
Tree.prototype.postorder = function rec(node, list) {
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

	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	return list;
};

/**
 * Locates the Node in this Tree which corresponds to the specified key.
 *
 * @param {*} key The key with which to retrieve the corresponding Node.
 * @return {Node} The Node with the given key
 */
Tree.prototype.find = function(key) {
	return this.findInSubtree(this.root, key);
};

/**
 * Recursively locates the Node in this Tree with the requested key.
 *
 * @param {Node} node The Node at which to begin the search
 * @param {*} key The desired value of the sought after Node
 * @return {Node|null} Either the first matching Node or null
 */
Tree.prototype.findInSubtree = function rec(node, key) {
	if (!node) {
		return null;
	}

	var ineq = this.compare(key, node.key);

	if (ineq < 0) {
		return rec(node.lChild, key);
	}

	if (ineq > 0) {
		return rec(node.rChild, key);
	}

	return node;
};

/**
 * Removes the Node corresponding to the given key from this Tree
 *
 * @param {*} key The key corresponding to the Node to remove
 * @return Whether the operation was successful
 */
Tree.prototype.remove = function(key) {
	var node = this.find(key);

	if (node) {
		this.removeNode(node);
		return true;
	}

	return false;
};

/**
 * Returns the range of nodes from this Tree which have values between the
 * given lower and upper bounds.
 *
 * @param {*} lower The lower bound of the range
 * @param {*} upper The upper bound of the range
 * @return {Array.<*>} The range of elements which are bounded by the above conditions
 */
Tree.prototype.getRange = function(lower, upper) {
	var range = [], curr = this.root, node, comp;

	while (curr) {
		comp = this.compare(curr.key, lower);

		if (comp < 0) {
			curr = curr.rChild;
		} else if ((comp > 0) && curr.lChild) {
			curr = curr.lChild;
		} else {
			break;
		}
	}

	while (curr && (this.compare(curr.key, upper) <= 0)) {
		range.push(curr.key);

		node = curr;
		while ((node = node.eq)) {
			range.push(node.key);
		}

		curr = curr.gt;
	}

	return range;
};

/**
 * Returns an inorder traversal of this Tree according to the doubly-linked list,
 * rather than the binary search tree.  This is a faster method than the traditional
 * BST inorder traversal, and is useful for debugging.
 *
 * @return {Array.<*>} A list of elements in this Tree in ascending order
 */
Tree.prototype.dlldump = function() {
	var curr = this.smallest(), dump = [], node;

	while (curr) {
		dump.push(curr.key);

		node = curr;
		while ((node = node.eq)) {
			dump.push(node.key);
		}

		curr = curr.gt;
	}

	return dump;
};

/**
 * Allows this Tree to function as a priority queue by removing and returning
 * the value of the greatest node.
 *
 * @return {*} The value of the greatest node in this Tree
 */
Tree.prototype.dequeue = function() {
	var node = this.biggest();

	if (node) {
		this.removeNode(node);
		return node.key;
	}

	return null;
};


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                          Initialize the Plugin                           ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


NS.Tree = Tree;

}(window));

