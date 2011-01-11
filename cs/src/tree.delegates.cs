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
using CG = System.Collections.Generic;

namespace DllBest {

	/// <summary>
	/// Provides a base Tree class for all Doubly-Linked CG.List, Binary Extended
	/// Search Tree classes. </summary>
	public abstract partial class Tree<T,N> : IRedundant<T,N>, IUnique<T,N>
		where N : Node<T,N>, new() {

		/// <summary>
		/// Compares two elements x and y.  The return value should be less
		/// than zero of x is less than y, equal to zero if x is equal to y,
		/// or greater than zero if x is greater than y </summary>
		///
		/// <param name="x">
		/// The first element of type T to compare </param>
		///
		/// <param name="y">
		/// The second element of type T to comapre </param>
		public delegate int Comparator(T x, T y);

		/// <summary>
		/// Returns the value of this Tree at the specified index </summary>
		///
		/// <param name="index">
		/// Index at which to retrieve the value </param>
		///
		/// <returns>
		/// Value of this Tree at index </returns>
		public delegate T Indexer(int index, N node);

		/// <summary>
		/// Recursively traverses this Tree in some order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		public delegate void Order(N node, CG.List<T> list);

		/// <summary>
		/// Returns the range of nodes from this Tree whose values are bounded
		/// by lower and upper </summary>
		///
		/// <param name="lower">
		/// Lower bound of the elements to return </param>
		///
		/// <param name="upper">
		/// Upper bound of the elements to return </param>
		///
		/// <returns>
		/// A list of the bounded elements in this Tree </returns>
		public delegate CG.List<T> Ranger(T lower, T upper);

		/// <summary>
		/// Inserts a value into this Tree </summary>
		///
		/// <param name="value">
		/// Value to insert into this Tree </param>
		public delegate void Inserter(T value);
	}
}

