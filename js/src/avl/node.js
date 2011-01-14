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
 * @param {*} value The value to associate with this Node
 * @constructor
 */
function Node(value) {
	this.__super__(value);
}

NS.Node = Node.inherits(DllBest.Node).extend({
	

	////////////////////////////////////////////////////////////////////////
	///                                                                  ///
	///                          Default Fields                          ///
	///                                                                  ///
	////////////////////////////////////////////////////////////////////////


	parent : null,


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
	isLeaf: function() {
		return (this.height === 0);
	},

	/**
	 * Returns whether this Node is a branch (i.e. it has exactly one child).
	 *
	 * @return {boolean} Whether this Node is a branch node
	 */
	isBranch: function() {
		var lc = !!this.lChild, rc = !!this.rChild;
		return ((lc && !rc) || (!lc && rc));
	},

	/**
	 * Returns the maximum height between this Node's two children, or -1 if this
	 * Node is a leaf node.
	 *
	 * @return {number} Either the max height of this Node's children or -1
	 */
	maxChildHeight: function() {
		var lHeight = (this.lChild) ? this.lChild.height : -1,
			rHeight = (this.rChild) ? this.rChild.height : -1;

		return (lHeight > rHeight) ? lHeight : rHeight;
	},

	/**
	 * Returns the balance of this Node, which is calculated as the difference
	 * between the heights of its left and right children.
	 *
	 * @return {number} The balance of this Node
	 */
	balance: function() {
		var lHeight = (this.lChild) ? this.lChild.height : -1,
			rHeight = (this.rChild) ? this.rChild.height : -1;

		return (lHeight - rHeight);
	},

	/**
	 * Returns whether this Node is balanced
	 *
	 * @return {boolean} Whether node is balanced
	 */
	isBalanced: function() {
		var balance = this.balance();
		return ((balance >= -1) && (balance <= 1));
	},


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Instance Methods                             ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	/**
	 * Assigns the values of the given Node to this one
	 *
	 * @param {Node} node The node whose properties to assume
	 * @param {boolean} value Whether to accept node's value as well
	 */
	assign: function(node, value) {
		this.__proto__.assign(node, value);

		this.parent = node.parent;

		if (this.lChild) {
			this.lChild.parent = this;
		}

		if (this.rChild) {
			this.rChild.parent = this;
		}
	},

	/**
	 * Returns a string representation for this Node, which is suitable for printing.
	 *
	 * @return {string} A string representation of this Node
	 */
	toString: function() {
		return this.value + '(' + this.height + ')';
	}
});

}(window));

