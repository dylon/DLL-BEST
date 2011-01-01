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
 * @depends "../node.js"
 */
(function(window) {


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        Local Variable Definitions                        ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/** Global namespace */
var DllBest = window.DllBest,

/** Targeted namespace */
NS = DllBest.Avl || (DllBest.Avl = {});


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                       DllBest.Avl.Node Constructor                       ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Constructs a new Node to insert into the corresponding Avl Tree.
 *
 * @param {*} key The key to associate with this Node
 * @constructor
 */
function Node(key) {
	this.__super__(key);
}

Node.inherits(DllBest.Node);


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                                Properties                                ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Returns whether this Node is a leaf node (i.e., it has no children).
 *
 * @return {boolean} Whether this Node is a leaf node
 */
Node.prototype.isLeaf = function() {
	return (this.height === 0);
};

/**
 * Returns whether this Node is a branch (i.e. it has exactly one child).
 *
 * @return {boolean} Whether this Node is a branch node
 */
Node.prototype.isBranch = function() {
	var lc = !!this.lChild, rc = !!this.rChild;
	return ((lc && !rc) || (!lc && rc));
};

/**
 * Returns the maximum height between this Node's two children, or -1 if this
 * Node is a leaf node.
 *
 * @return {number} Either the max height of this Node's children or -1
 */
Node.prototype.maxChildHeight = function() {
	var lHeight = (this.lChild) ? this.lChild.height : -1,
	    rHeight = (this.rChild) ? this.rChild.height : -1;

	return (lHeight > rHeight) ? lHeight : rHeight;
};

/**
 * Returns the balance of this Node, which is calculated as the difference
 * between the heights of its left and right children.
 *
 * @return {number} The balance of this Node
 */
Node.prototype.balance = function() {
	var lHeight = (this.lChild) ? this.lChild.height : -1,
		rHeight = (this.rChild) ? this.rChild.height : -1;

	return (lHeight - rHeight);
};

/**
 * Returns whether this Node is balanced
 *
 * @return {boolean} Whether node is balanced
 */
Node.prototype.isBalanced = function() {
	var balance = this.balance();
	return ((balance >= -1) && (balance <= 1));
};


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        Initialize Default Fields                         ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


Node.prototype.height = 0;


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                             Instance Methods                             ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Assigns the values of the given Node to this one
 *
 * @param {Node} node The node whose properties to assume
 * @param {boolean} key Whether to accept node's key as well
 */
Node.prototype.assign = function(node, key) {
	this.__proto__.assign(node, key);
	this.height = node.height;
};

/**
 * Returns a string representation for this Node, which is suitable for printing.
 *
 * @return {string} A string representation of this Node
 */
Node.prototype.toString = function() {
	return this.key + '(' + this.height + ')';
};


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                          Initialize the Plugin                           ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


NS.Node = Node;

}(window));
