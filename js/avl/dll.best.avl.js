'use strict';

/*global window */

/*!
 * Copyright (C) 2010 Dylon Edwards
 *
 * The AVL Tree implementation below was rewritten from @pgrafov's
 * implementation in Python, available from the following address:
 * @link https://github.com/pgrafov/python-avl-tree
 *
 * It has been modified to be what I've come to call a Doubly-Linked List
 * Binary Extended Search Tree (DLL BEST), which is essentially a binary search
 * tree that has been merged with a doubly-linked list structure; the purpose
 * is to enable the creation of a sorted doubly-linked list in O(log(N)) time
 * with the assistance of the BST insert method and to provide range querying
 * such that the base of the range can be found in O(log(N)) time (via the BST
 * find method) and the bounded elements can be collected in constant O(N) time
 * by simply traversing the doubly-linked list until the supremum of the set
 * has been located.
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
(function(window) {


/* ===============================
 * Initialize the Node constructor
 * ===============================
 */


/**
 * Constructs a new Node to insert into the corresponding AVL Tree.
 *
 * @param {*} key The key to associate with this Node
 * @constructor
 */
function Node(key) {
	this.key = key;
	this.parent = null;
	this.lChild = null;
	this.rChild = null;
	this.height = 0;

	this.lt = null;
	this.gt = null;
	this.eq = null;
}

/**
 * Assigns the values of this Node to those of the given one
 *
 * @param {Node} node The node whose properties to assume
 * @param {boolean} key Whether to accept node's key as well
 */
Node.prototype.assign = function(node, key) {
	this.parent = node.parent;
	this.lChild = node.lChild;
	this.rChild = node.rChild;
	this.height = node.height;

	if (this.lChild) {
		this.lChild.parent = this;
	}

	if (this.rChild) {
		this.rChild.parent = this;
	}

	if (key) {
		this.key = node.key;
	}

	this.lt = node.lt;
	this.gt = node.gt;
	
	if (this.lt) {
		this.lt.gt = this;
	}

	if (this.gt) {
		this.gt.lt = this;
	}
};

/**
 * Returns a string representation for this Node, which is suitable for printing.
 *
 * @return {string} A string representation of this Node
 */
Node.prototype.toString = function() {
	return this.key + '(' + this.height + ')';
};

/**
 * Returns whether this Node is a leaf node (i.e., it has no children).
 *
 * @return {boolean} Whether this Node is a leaf node
 */
Node.prototype.isLeaf = function() {
	return (this.height === 0);
};

/**
 * Returns the maximum height between this Node's two children, or -1 if this
 * Node is a leaf node.
 *
 * @return {number} Either the max height of this Node's children or -1
 */
Node.prototype.maxChildrenHeight = function() {
	var lHeight, rHeight;

	if (this.lChild && this.rChild) {
		lHeight = this.lChild.height;
		rHeight = this.rChild.height;

		// Return the max{lHeight, rHeight}
		return (lHeight > rHeight) ? lHeight : rHeight;

	} else if (this.lChild) {
		return this.lChild.height;
	
	} else if (this.rChild) {
		return this.rChild.height;
	}

	return -1;
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
	switch (this.balance()) {
		case '-1':
		case  '0':
		case  '1':
			return true;
	}

	return false;
};


/* ==================================
 * Initialize the AVLTree constructor
 * ==================================
 */


/**
 * Constructs a new AVLTree which functions as a BEST tree (or a Binary Extended
 * Search Tree).
 *
 * @param {function} comparator The function to use when comparing Node instances
 * @constructor
 */
function AVLTree(comparator/*, arguments */) {
	this.root = null;
	this.elementsCount = 0;
	this.rebalanceCount = 0;

	var args = Array.prototype.slice.call(arguments, 1), i, n;

	if (comparator instanceof Function) {
		this.comparator = comparator;
	}
	
	if ((i = args.length)) {
		while ((n = args[-- i])) {
			this.insert(n);
		}
	}
}

/**
 * The default comparator for AVLTree.  This returns a raw comparison of the
 * keys of both nodes, in order of the first node to the second.  If the value
 * returned is -1, then node1 is less than node2; if the value returned is 0,
 * then node1 is equivalent to node2; if the value returned is 1, then node1 is
 * greater than node2.
 *
 * @param {Node} node1 The Node to compare with node2
 * @param {Node} node2 The Node to compare with node1
 * @return {number} -1, 0, or 1 depending on how node1 compares to node2
 */
AVLTree.prototype.comparator = function(node1, node2) {
	var key1 = node1.key, key2 = node2.key;
	return ((key1 > key2) ? 1 : (key1 < key2) ? -1 : 0);
};

/**
 * Compares two Node instances.  This function should return a value < 0 (zero)
 * if (node1 < node2), a value > 0 (zero) if (node1 > node2), or 0 (zero) if
 * (node1 = node2).
 *
 * @param {Node} node1 The Node to compare with node2
 * @param {Node} node2 The Node to compare with node1
 * @return The comparison of node1 with node2
 */
AVLTree.prototype.compare = function(node1, node2) {
	return this.comparator.call(this, node1, node2);
};

/**
 * Returns the height (or number of levels, 1-indexed) of this AVLTree.  Should
 * this method return 0 (zero), this AVLTree is empty.
 *
 * @return {number} The height of this AVLTree
 */
AVLTree.prototype.height = function() {
	if (this.root) {
		return this.root.height;
	}

	return 0;
};

/**
 * Rebalances a given Node.  To see every case in which a Node will need to be
 * balanced, see the following resource:
 *
 * http://www.cse.ohio-state.edu/~sgomori/570/avlrotations.html
 *
 * @param {Node} nodeToRebalance The Node to rebalance
 */
AVLTree.prototype.rebalance = function(nodeToRebalance) {
	this.rebalanceCount += 1;
	
	var A = nodeToRebalance, B, C,
		F = A.parent;

	if (nodeToRebalance.balance() === -2) {
		if (nodeToRebalance.rChild.balance() <= 0) {
			/*
			 * Rebalance, case RRC
			 */
			
			B = A.rChild;
			C = B.rChild;

			A.rChild = B.lChild;

			if (A.rChild) {
				A.rChild.parent = A;
			}

			B.lChild = A;
			A.parent = B;

			if (!F) {
				this.root = B;
				this.root.parent = null;
			} else {
				if (F.rChild === A) {
					F.rChild = B;
				} else {
					F.lChild = B;
				}

				B.parent = F;
			}

			this.recomputeHeights(A);
			this.recomputeHeights(B.parent);
		} else {
			/*
			 * Rebalance, case RLC
			 */

			B = A.rChild;
			C = B.lChild;
			
			B.lChild = C.rChild;

			if (B.lChild) {
				B.lChild.parent = B;
			}

			A.rChild = C.lChild;

			if (A.rChild) {
				A.rChild.parent = A;
			}

			C.rChild = B;
			B.parent = C;
			C.lChild = A;
			A.parent = C;

			if (!F) {
				this.root = C;
				this.root.parent = null;
			} else {
				if (F.rChild === A) {
					F.rChild = C;
				} else {
					F.lChild = C;
				}

				C.parent = F;
			}

			this.recomputeHeights(A);
			this.recomputeHeights(B);
		}
	} else {
		if (nodeToRebalance.lChild.balance() >= 0) {
			/*
			 * Rebalance, case LLC
			 */

			B = A.lChild;
			C = B.lChild;

			A.lChild = B.rChild;

			if (A.lChild) {
				A.lChild.parent = A;
			}

			B.rChild = A;
			A.parent = B;

			if (!F) {
				this.root = B;
				this.root.parent = null;
			} else {
				if (F.rChild === A) {
					F.rChild = B;
				} else {
					F.lChild = B;
				}

				B.parent = F;
			}

			this.recomputeHeights(A);
			this.recomputeHeights(B.parent);
		} else {
			/*
			 * Rebalance, case LRC
			 */

			B = A.lChild;
			C = B.rChild;

			A.lChild = C.rChild;

			if (A.lChild) {
				A.lChild.parent = A;
			}

			B.rChild = C.lChild;

			if (B.rChild) {
				B.rChild.parent = B;
			}

			C.lChild = B;
			B.parent = C;

			C.rChild = A;
			A.parent = C;

			if (!F) {
				this.root = C;
				this.root.parent = null;
			} else {
				if (F.rChild === A) {
					F.rChild = C;
				} else {
					F.lChild = C;
				}

				C.parent = F;
			}

			this.recomputeHeights(A);
			this.recomputeHeights(B);
		}
	}
};

/**
 * A testing method which ensures the data integrity of this AVLTree is good.
 *
 * @param {Node} node The Node on which to begin the sanity check
 */
AVLTree.prototype.sanityCheck = function(node) {
	var height, balFactor;

	if (!node) {node = this.root;}

	if ((!node) || (node.isLeaf() && (!node.parent))) {
		return;
	}

	height = node.maxChildrenHeight() + 1;
	if (node.height !== height) {
		throw ("Invalid height for node " + node + ": " + node.height + " instead of " + height + "!");
	}

	balFactor = node.balance();

	if (!((balFactor >= -1) && (balFactor <= 1))) {
		throw ("Balance factor for node " + node + " is " + balFactor + "!");
	}

	if (node.lChild === node) {
		throw ("Circular reference for node " + node + ": node.lChild is node!");
	}

	if (node.rChild === node) {
		throw ("Circular reference for node " + node + ": node.rChild is node!");
	}
	
	if (node.lChild) {
		if (node.lChild.parent !== node) {
			throw ("Left child of node " + node + " doesn't know who his father is!");
		}

		if (node.lChild.key > node.key) {
			throw ("Key of left child of node " + node + " is greater than the key of his parent!");
		}

		this.sanityCheck(node.lChild);
	}

	if (node.rChild) {
		if (node.rChild.parent !== node) {
			throw ("Left child of node " + node + " doesn't know who his father is!");
		}

		if (node.rChild.key < node.key) {
			throw ("Key of left child of node " + node + " is less than the key of his parent!");
		}

		this.sanityCheck(node.rChild);
	}
};

/**
 * Recomputes the heights of all the nodes from the current one to the root.
 *
 * @param {Node} node The Node at which to begin recomputing heights
 */
AVLTree.prototype.recomputeHeights = function(node) {
	var changed = true, oldHeight;

	while (node && changed) {
		oldHeight = node.height;

		node.height = ((node.rChild || node.lChild) ?
			node.maxChildrenHeight() + 1 :
			0);

		changed = (node.height !== oldHeight);
		node = node.parent;
	}
};

/**
 * Inserts a child Node into the descendants of the given parent Node.
 *
 * @param {Node} parent The parent node at which to begin the insertion
 * @param {Node} child The child node to insert
 */
AVLTree.prototype.addAsChild = function(parent, child) {
	var nodeToRebalance = null, node;

	if (child.key < parent.key) {
		child.gt = parent;

		if (!parent.lChild) {
			parent.lChild = child;
			child.parent = parent;

			if (parent.lt) {
				parent.lt.gt = child;
			}

			parent.lt = child;

			if (parent.height === 0) {
				node = parent;

				while (node) {
					node.height = node.maxChildrenHeight() + 1;
					if (!node.isBalanced()) {
						nodeToRebalance = node;
						break;
					}

					node = node.parent;
				}
			}
		} else {
			this.addAsChild(parent.lChild, child);
		}
	} else if (child.key > parent.key) {
		child.lt = parent;

		if (!parent.rChild) {
			parent.rChild = child;
			child.parent = parent;

			if (parent.gt) {
				parent.gt.lt = child;
			}

			parent.gt = child;

			if (parent.height === 0) {
				node = parent;

				while (node) {
					node.height = node.maxChildrenHeight() + 1;
					if (!node.isBalanced()) {
						nodeToRebalance = node;
						break;
					}

					node = node.parent;
				}
			}
		} else {
			this.addAsChild(parent.rChild, child);
		}
	} else {
		child.eq = parent.eq;
		parent.eq = child;

		// Only the topmost node should maintain the DLL
		child.lt = null;
		child.gt = null;
	}

	if (nodeToRebalance) {
		this.rebalance(nodeToRebalance);
	}
};

/**
 * Creates and inserts a new Node using the provided key as its value.
 *
 * @param {*} key The key to assign the new Node
 */
AVLTree.prototype.insert = function(key) {
	var node = new Node(key);

	if (!this.root) {
		this.root = node;
	} else if (!this.find(key)) {
		this.elementsCount += 1;
		this.addAsChild(this.root, node);
	}
};

/**
 * Creates and appends a new Node using the provided key as its value. The
 * difference between this.append and this.insert is that this.insert only
 * adds a new node if there is not one with an equivalent value already in
 * this AVLTree.
 *
 * @param {*} key The key to assign the new Node
 */
AVLTree.prototype.append = function(key) {
	var node = new Node(key);

	if (!this.root) {
		this.root = node;
	} else {
		this.elementsCount += 1;
		this.addAsChild(this.root, node);
	}
};

/**
 * Locates and returns the biggest Node from the given one
 *
 * @param {Node=} node The Node at which to begin the traversal
 * @return {Node} The smallest Node branching from node
 */
AVLTree.prototype.findBiggest = function(node) {
	if (!node) {node = this.root;}

	if (node) {
		while (node.rChild) {
			node = node.rChild;
		}
	}

	return node;
};

/**
 * Locates and returns the smallest Node from the given one
 *
 * @param {Node=} node The Node at which to begin the traversal
 * @return {Node} The largest Node branching from node
 */
AVLTree.prototype.findSmallest = function(node) {
	if (!node) {node = this.root;}

	if (node) {
		while (node.lChild) {
			node = node.lChild;
		}
	}

	return node;
};

/**
 * Traverses this AVLTree in a non-recursive fashion, from the least Node
 * to the greatest.
 *
 * @return {Array.<*>} An array containing all this AVLTree's ascending values
 */
AVLTree.prototype.inorderNonRecursive = function() {
	var node = this.root,
		list = [],
		next;

	while (node.lChild) {
		node = node.lChild;
	}

	while (node) {
		list.push(node.key);

		next = node;
		while ((next = next.eq)) {
			list.push(next.key);
		}

		if (node.rChild) {
			node = node.rChild;

			while (node.lChild) {
				node = node.lChild;
			}
		} else {
			while ((node.parent) && (node === node.parent.rChild)) {
				node = node.parent;
			}

			node = node.parent;
		}
	}

	return list;
};

/**
 * Recursively traverses this AVLTree in ascending order
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this AVLTree in ascending order
 */
AVLTree.prototype.preorder = function(node, list) {
	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	if (node.lChild) {
		list = this.preorder(node.lChild, list);
	}

	if (node.rChild) {
		list = this.preorder(node.rChild, list);
	}

	return list;
};

/**
 * Recursively traverses this AVLTree in ascending order
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this AVLTree in ascending order
 */
AVLTree.prototype.inorder = function(node, list) {
	if (node.lChild) {
		list = this.inorder(node.lChild, list);
	}

	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	if (node.rChild) {
		list = this.inorder(node.rChild, list);
	}

	return list;
};

/**
 * Recursively traverses this AVLTree in descending order
 *
 * @param {Node} node The node at which to begin the traversal
 * @param {Array.<*>} list The list to which to append the values
 * @return {Array.<*>} The values of this AVLTree in descending order
 */
AVLTree.prototype.postorder = function(node, list) {
	if (node.lChild) {
		list = this.postorder(node.lChild, list);
	}

	if (node.rChild) {
		list = this.postorder(node.rChild, list);
	}

	list.push(node.key);

	var next = node;
	while ((next = next.eq)) {
		list.push(next.key);
	}

	return list;
};

/**
 * Returns a list of all the values in this AVLTree, in the requested order.  For
 * preorder, pass the value 0 (zero); for inorder, pass the value 1; for postorder,
 * pass the value 2; for non-recursive inorder, pass the value 3.
 *
 * @param {number} preInPost An integer describing in which order to return the values
 * @return {Array.<*>} An array containing all the values in this AVLTree
 */
AVLTree.prototype.asList = function(preInPost) {
	var list = [];

	if (!this.root) {
		return list;
	}

	switch (preInPost) {
		case 0: return this.preorder(this.root, list);
		case 1: return this.inorder(this.root, list);
		case 2: return this.postorder(this.root, list);
		case 3: return this.inorderNonRecursive(this.root, list);
	}

	return null;
};

/**
 * Locates the Node in this AVLTree which corresponds to the specified key.
 *
 * @param {*} key The key with which to retrieve the corresponding Node.
 * @return {Node} The Node with the given key
 */
AVLTree.prototype.find = function(key) {
	return this.findInSubtree(this.root, key);
};

/**
 * Recursively locates the Node in this AVLTree with the requested key.
 *
 * @param {Node} node The Node at which to begin the search
 * @param {*} key The desired value of the sought after Node
 * @return {Node|null} Either the first matching Node or null
 */
AVLTree.prototype.findInSubtree = function(node, key) {
	if (!node) {
		return null;
	}

	if (key < node.key) {
		return this.findInSubtree(node.lChild, key);
	}

	if (key > node.key) {
		return this.findInSubtree(node.rChild, key);
	}

	return node;
};

/**
 * Removes a particular Node from this AVLTree
 *
 * @param {Node} node The Node to remove
 */
AVLTree.prototype.removeNode = function(node) {
	this.elementsCount -= 1;
	var eq = node.eq;
	
	/*
	 * Remove the node from the doubly-linked list
	 */

	if (eq) {
		eq.assign(node);
		return; ///<-- NOTE: Return here
	}

	if (node.lt) {
		node.lt.gt = node.gt;
	}

	if (node.gt) {
		node.gt.lt = node.lt;
	}

	/*
	 * There are three cases:
	 *
	 * 1) The node is a leaf.  Remove it and return.
	 *
	 * 2) The node is a branch (has only 1 child).  Make the pointer to this
	 * node point to the child of this node.
	 *
	 * 3) The node has two children.  Swap items with the successor of the
	 * node (the smallest item in its right subtree) and delete the successor
	 * from the right subtree of the node.
	 */

	if (node.isLeaf()) {
		this.removeLeaf(node);
	} else if ((!node.lChild && node.rChild) || (node.lChild && !node.rChild)) {
		this.removeBranch(node);
	} else {
		this.swapWithSuccessorAndRemove(node);
	}
};

/**
 * Removes the Node corresponding to the given key from this AVLTree
 *
 * @param {*} key The key corresponding to the Node to remove
 */
AVLTree.prototype.remove = function(key) {
	var node = this.find(key);

	if (node) {
		this.removeNode(node);
	}
};

/**
 * Instructions for removing a leaf node from this AVLTree
 *
 * @param {Node} node The leaf node to remove
 */
AVLTree.prototype.removeLeaf = function(node) {
	var parent = node.parent;

	if (parent) {
		if (parent.lChild === node) {
			parent.lChild = null;
		} else {
			parent.rChild = null;
		}

		this.recomputeHeights(parent);
	} else {
		this.root = null;
	}

	node = parent;
	while (node) {
		if (!node.isBalanced()) {
			this.rebalance(node);
		}

		node = node.parent;
	}
};

/**
 * Instructions for removing a node which has children on one side only from this AVLTree.
 *
 * @param {Node} node The node to remove
 */
AVLTree.prototype.removeBranch = function(node) {
	var parent = node.parent;

	if (parent) {
		if (parent.lChild) {
			parent.lChild = (node.rChild || node.lChild);
		} else {
			parent.rChild = (node.rChild || node.lChild);
		}

		if (node.lChild) {
			node.lChild.parent = parent;
		} else {
			node.rChild.parent = parent;
		}

		this.recomputeHeights(parent);
	}

	node = parent;
	while (node) {
		if (!node.isBalanced()) {
			this.rebalance(node);
		}

		node = node.parent;
	}
};

/**
 * Instructions for removing a node which has children on both sides from this AVLTree
 *
 * @param {Node} node The Node to remove
 */
AVLTree.prototype.swapWithSuccessorAndRemove = function(node) {
	var successor = this.findSmallest(node.rChild);
	this.swapNodes(node, successor);

	if (node.height === 0) {
		this.removeLeaf(node);
	} else {
		this.removeBranch(node);
	}
};

/**
 * Swaps two nodes in this AVLTree
 *
 * @param {Node} node1 The Node to swap with node2
 * @param {Node} node2 The Node to swap with node1
 */
AVLTree.prototype.swapNodes = function(node1, node2) {
	var parent1 = node1.parent,
		lChild1 = node1.lChild,
		rChild1 = node1.rChild,

		parent2 = node2.parent,
		lChild2 = node2.lChild,
		rChild2 = node2.rChild,
		
		tmp;
	
	tmp = node1.height;
	node1.height = node2.height;
	node2.height = tmp;

	if (parent1) {
		if (parent1.lChild === node1) {
			parent1.lChild = node2;
		} else {
			parent1.rChild = node2;
		}

		node2.parent1 = parent1;
	} else {
		this.root = node2;
		node2.parent = null;
	}

	node2.lChild = lChild1;
	lChild1.parent = node2;

	node1.lChild = lChild2;
	node1.rChild = rChild2;

	if (rChild2) {
		rChild2.parent = node1;
	} else if (parent2 !== node1) {
		node2.rChild = rChild1;
		rChild1.parent = node2;

		parent2.lChild = node1;
		node1.parent = parent2;
	} else {
		node2.rChild = node1;
		node1.parent = node2;
	}
};

/**
 * Returns the range of nodes from this AVLTree which have values between
 * the given lower and upper bounds.
 *
 * @param {*} lower The lower bound of the range
 * @param {*} upper The upper bound of the range
 * @return {Array.<*>} The range of elements which are bounded by the above conditions
 */
AVLTree.prototype.getRange = function(lower, upper) {
	var range = [], curr = this.root, node;

	while (curr) {
		if (curr.key < lower) {
			curr = curr.rChild;
		} else if ((curr.key > lower) && curr.lChild) {
			curr = curr.lChild;
		} else {
			break;
		}
	}

	while (curr && (curr.key <= upper)) {
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
 * Returns an inorder traversal of this AVLTree according to the doubly-linked list,
 * rather than the binary search tree.  This is a faster method than the traditional
 * BST inorder traversal, and is useful for debugging.
 *
 * @return {Array.<*>} A list of elements in this AVLTree in ascending order
 */
AVLTree.prototype.dlldump = function() {
	var curr = this.findSmallest(), range = [], node;

	while (curr) {
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
 * Allows this AVLTree to function as a priority queue by removing and returning
 * the value of the greatest node.
 *
 * @return {*} The value of the greatest node in this AVLTree
 */
AVLTree.prototype.dequeue = function() {
	var node = this.findBiggest();

	if (node) {
		this.removeNode(node);
		return node.key;
	}

	return null;
};

// Export the AVL Tree
window.AVLTree = AVLTree;

}(window));

