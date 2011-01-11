/// Copyright (C) 2010 Dylon Edwards
/// 
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;

namespace DllBest {

	/// <summary>
	/// A node for use within the DLL BEST tree </summary>
	public interface INode<T,N> 
		where N : INode<T,N> {

		/// <summary>
		/// Whether this Node is a leaf node (i.e. it has no children)
		/// </summary>
		bool IsLeaf { get; }

		/// <summary>
		/// Whether this Node is a branch (i.e. it has exactly one child)
		/// </summary>
		bool IsBranch { get; }

		/// <summary>
		/// The maximum height between this Node's children, or -1 if this is a
		/// leaf node. </summary>
		int MaxChildHeight { get; }
		
		/// <summary>
		/// Pointer to this Node's left BST child </summary>
		N LChild { get; set; }

		/// <summary>
		/// Pointer to this Node's right BST child </summary>
		N RChild { get; set; }

		/// <summary>
		/// Number of levels within the subtree formed with this Node as the
		/// root. </summary>
		int Height { get; set; }

		/// <summary>
		/// Number of this Node's BST child Node's </summary>
		int Children { get; set; }

		/// <summary>
		/// Pointer to the DLL node immediately less than this one </summary>
		N Lt { get; set; }

		/// <summary>
		/// Pointer to the DLL node immediately greater than this one
		/// </summary>
		N Gt { get; set; }

		/// <summary>
		/// Pointer to the next LL node equal to this one </summary>
		N Eq { get; set; }

		/// <summary>
		/// Value of this Node.  This property may be set as many times as one
		/// wants until get is called, at which point it becomes immutable (so
		/// it can be stored in a BST, Dictionary, etc.) </summary>
		T Value { get; set; }

		/// <summary>
		/// Assigns the values of the given Node to this one </summary>
		///
		/// <param name="node"> Node whose values to assign this one </param>
		/// <param name="value"> Whether to assign the value of the given Node to
		/// this one </param>
		void Assign(N node, bool value);

		/// <summary>
		/// Assigns the values of the given Node to this one </summary>
		///
		/// <param name="node"> Node whose values to assign this one </param>
		/// this one </param>
		void Assign(N node);
	}
}

